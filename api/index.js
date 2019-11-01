import _ from 'underscore'
import { create, find } from './data'
require('dotenv').config()

let API_KEYS = []
try {
  API_KEYS = JSON.parse(process.env.IOT_API_KEYS)
} catch (e) {
  console.error('!!! env.IOT_API_KEYS must be set to JSON array of strings !!!')
  throw e
}

function _authMW (req, res, next) {
  const key = req.query.apikey
  delete req.query.apikey
  if (!_.contains(API_KEYS, key)) {
    return next({ status: 401 })
  }
  next()
}

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

  app.post('/', _authMW, JSONBodyParser, (req, res, next) => {
    create(req.body, knex)
      .then(results => {
        res.json(results)
        next()
      })
      .catch(next)
  })
}
