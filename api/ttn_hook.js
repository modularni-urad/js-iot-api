import _ from 'underscore'
const ttn = require('ttn')
require('dotenv').config()

let APPS = []
try {
  APPS = JSON.parse(process.env.TTN_APPS)
  console.log(`connecting to ${JSON.stringify(APPS, null, 2)}`)
} catch (e) {
  console.error('!!! env.TTN_APPS must be set to JSON array !!!')
  throw e
}

function create (body, knex) {
  const typPromises = _.map(body.payload_fields, (v, k) => {
    const data = {
      typ: k,
      value: v,
      dev_id: body.dev_id,
      app_id: body.app_id,
      counter: body.counter
    }
    return knex('envirodata').insert(data).catch(err => console.error(err))
  })
  return Promise.all(typPromises)
}

// https://www.thethingsnetwork.org/docs/applications/nodejs/quick-start.html
export function InitTTNHooks (knex) {
  _.map(APPS, app => {
    ttn.data(app[0], app[1])
      .then(client => {
        client.on('uplink', (devID, payload) => {
          create(payload, knex)
        })
      })
      .catch(error => {
        console.error(`Connecting to app: ${app[0]} failed!`)
        console.error(error)
        process.exit(1)
      })
  })
}
