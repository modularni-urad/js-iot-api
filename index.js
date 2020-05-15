import { findMetadata } from './api/metadata'
import apps from './api/apps'
import { appStart, appStop } from './mqtt_client'
import { TNAMES } from './consts'

export default function InitApp (app, JSONBodyParser, knex) {
  knex(TNAMES.APPS).then(apps => {
    apps.map((app) => {
      appStart(app, knex)
    })
  })

  app.get('/metadata', async (req, res, next) => {
    try {
      res.json(await findMetadata(req.query, knex))
    } catch (err) {
      next(err)
    }
  })

  app.get('/app', async (req, res, next) => {
    try {
      res.json(await apps.find(req.query, knex))
    } catch (err) {
      next(err)
    }
  })

  app.post('/app', async (req, res, next) => {
    try {
      const app = await apps.create(req.body, knex)
      await appStart(app)
      res.json(app)
    } catch (err) {
      next(err)
    }
  })

  app.put('/app/:id', async (req, res, next) => {
    try {
      appStop(req.params.id)
      const app = await apps.update(req.params.id, req.body, knex)
      await appStart(app)
      res.json(app)
    } catch (err) {
      next(err)
    }
  })

  app.post('/restart/:id', async (req, res, next) => {
    try {
      await appStart(app)
      res.json(app)
    } catch (err) {
      next(err)
    }
  })
}
