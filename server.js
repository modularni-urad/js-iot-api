import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

import InitApp from './index'
import InitErrorHandlers from './error_handlers'
import initDB from './db'

async function init (host, port) {
  const knex = await initDB()
  const app = express()
  app.use(cors())
  InitApp(app, bodyParser.json(), knex)
  InitErrorHandlers(app) // ERROR HANDLING

  app.listen(port, host, (err) => {
    if (err) { throw err }
    console.log(`ents do magic on ${host}:${port}`)
  })
}

try {
  const host = process.env.HOST || '127.0.0.1'
  const port = process.env.PORT
  init(host, port)
} catch (err) {
  console.error(err)
}
