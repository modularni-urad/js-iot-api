import { find } from './api/data'
import { findDevices } from './api/devices'
import TTNClient from './ttn_data/mqtt_client'
const TTNApps = _getApps()

export default function InitApp (app, JSONBodyParser, knex) {
  TTNClient(knex, TTNApps)

  app.get('/data', async (req, res, next) => {
    try {
      res.json(await find(req.query, knex))
    } catch (err) {
      next(err)
    }
  })

  app.get('/devices', async (req, res, next) => {
    try {
      res.json(await findDevices(req.query, knex))
    } catch (err) {
      next(err)
    }
  })
}

function _getApps () {
  try {
    const APPS = JSON.parse(process.env.TTN_APPS)
    return APPS
  } catch (e) {
    console.error('!!! env.TTN_APPS must be set to JSON array !!!')
    throw e
  }
}

// zdejsi 41528
// remote mqtt: 1883
