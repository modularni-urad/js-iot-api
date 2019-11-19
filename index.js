import { InitDataApp, InitDevicesApp } from './api'
import { InitStorageIntegration } from './ttn_data/storage_integration'

export default function InitApp (app, express, JSONBodyParser, knex) {
  //
  const TTNApps = _getApps()
  InitStorageIntegration(knex, TTNApps) // ttn data downloader

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
    console.log(`connecting to ${JSON.stringify(APPS, null, 2)}`)
    return APPS
  } catch (e) {
    console.error('!!! env.TTN_APPS must be set to JSON array !!!')
    throw e
  }
}
