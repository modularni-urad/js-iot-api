import { find } from './data'
import { findDevices } from './devices'

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
  app.get('/', (req, res, next) => {
    findDevices(req.query)
      .then(results => {
        res.json(results)
        next()
      })
      .catch(next)
  })
}
