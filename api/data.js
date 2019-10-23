import _ from 'underscore'
import * as dotenv from 'dotenv'
dotenv.config()

let API_KEYS = []
try {
  API_KEYS = JSON.parse(process.env.IOT_API_KEYS)
} catch (e) {
  console.error('!!! env.IOT_API_KEYS must be set to JSON array of strings !!!')
  throw e
}

export function find (cond, knex) {
  return knex('envirodata').where(cond)
}

export function create (sensorid, body, knex) {
  return Promise.all(_.map(body, (v, k) => {
    const data = {
      typ: k, value: v, sensorid: sensorid
    }
    return knex('envirodata').insert(data)
  }))
}

function _authMW (req, res, next) {
  const key = req.query.apikey
  delete req.query.apikey
  if (!_.contains(API_KEYS, key)) {
    return next({ status: 401 })
  }
  next()
}

export function InitDataApp (app, knex) {
  //
  app.get('/', _authMW, (req, res, next) => {
    find(req.query, knex)
      .then(results => {
        res.json(results)
        next()
      })
      .catch(next)
  })

  app.post(`/:sensorid([0-9]+)`, _authMW, (req, res, next) => {
    create(req.params.sensorid, req.query, knex)
      .then(() => {
        res.status(201).json({})
        next()
      })
      .catch(next)
  })
}
