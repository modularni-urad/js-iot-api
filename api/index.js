import { find } from './data'
import { deviceManager } from './devices'

export function InitDataApp (app, JSONBodyParser, knex) {
  //
  app.get('/', (req, res, next) => {
    find(req.query, knex)
      .then(results => {
        res.json(results)
        next()
      })
      .catch(next)
  })
}

export function InitDevicesApp (app, ttnApps) {
  //
  const manager = deviceManager(ttnApps)

  app.get('/', (req, res, next) => {
    manager.list(req.query.app)
      .then(results => {
        res.json(results)
        next()
      })
      .catch(next)
  })
}
