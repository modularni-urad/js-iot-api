import { InitDataApp } from './api'

export default function InitApp (app, express, JSONBodyParser, knex) {
  //
  const dataApp = express()
  InitDataApp(dataApp, JSONBodyParser, knex)
  app.use('/data', dataApp)

  // TODO: prepsat s vyuzitim TTN api - tam jsou ulozena vsechna data o clients
  // const sensorApp = express()
  // InitSensorsApp(sensorApp, knex, authMW, JSONBodyParser)
  // app.use('/sensors', sensorApp)
}
