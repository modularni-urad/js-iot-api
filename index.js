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

  app.post('/app', JSONBodyParser, async (req, res, next) => {
    try {
      const created = await apps.create(req.body, knex)
      const app = Object.assign({ created }, req.body)
      await appStart(app, knex)
      res.json(app)
    } catch (err) {
      next(err)
    }
  })

  app.put('/app/:id', JSONBodyParser, async (req, res, next) => {
    try {
      appStop(req.params.id)
      await apps.update(req.params.id, req.body, knex)
      const app = await apps.get(req.body.app_id || req.params.id, knex)
      await appStart(app, knex)
      res.json(app)
    } catch (err) {
      next(err)
    }
  })
}
