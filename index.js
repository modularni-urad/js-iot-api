import { InitDataApp, InitDevicesApp } from './api'
import TTNClient from './ttn_data/mqtt_client'

export default function InitApp (app, express, JSONBodyParser, knex) {
  //
  const TTNApps = _getApps()
  TTNClient(knex, TTNApps)

  const dataApp = express()
  InitDataApp(dataApp, JSONBodyParser, knex)
  app.use('/data', dataApp)

  const sensorApp = express()
  InitDevicesApp(sensorApp, TTNApps)
  app.use('/devices', sensorApp)
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
