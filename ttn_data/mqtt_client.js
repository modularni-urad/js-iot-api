import _ from 'underscore'
import { create } from './data'
const ttn = require('ttn')
require('dotenv').config()

// https://www.thethingsnetwork.org/docs/applications/nodejs/quick-start.html
// OBSOLETE for now
export function InitMQTTClient (knex) {
  try {
    const APPS = JSON.parse(process.env.TTN_APPS)
    console.log(`connecting to ${JSON.stringify(APPS, null, 2)}`)
    _.map(APPS, app => {
      ttn.data(app[0], app[1])
        .then(client => {
          client.on('uplink', (devID, payload) => {
            create(payload, payload.metadata.time, knex)
          })
        })
        .catch(error => {
          console.error(`Connecting to app: ${app[0]} failed!`)
          console.error(error)
          process.exit(1)
        })
    })
  } catch (e) {
    console.error('!!! env.TTN_APPS must be set to JSON array !!!')
    throw e
  }
}
