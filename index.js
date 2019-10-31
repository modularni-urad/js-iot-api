
import { InitDataApp } from './api/data'
import { InitTTNHooks } from './api/ttn_hook'

export default function InitApp (app, express, knex) {
  //
  InitTTNHooks(knex)

  const dataApp = express()
  InitDataApp(dataApp, knex)
  app.use('/data', dataApp)

  // TODO: prepsat s vyuzitim TTN api - tam jsou ulozena vsechna data o clients
  // const sensorApp = express()
  // InitSensorsApp(sensorApp, knex, authMW, JSONBodyParser)
  // app.use('/sensors', sensorApp)
}
