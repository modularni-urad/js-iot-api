
import { InitSensorsApp } from './api/sensors'
import { InitDataApp } from './api/data'

export default function InitApp (app, express, knex, authMW, JSONBodyParser) {
  const dataApp = express()
  InitDataApp(dataApp, knex)
  app.use('/data', dataApp)

  const sensorApp = express()
  InitSensorsApp(sensorApp, knex, authMW, JSONBodyParser)
  app.use('/sensors', sensorApp)
}
