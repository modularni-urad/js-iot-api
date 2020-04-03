import _ from 'underscore'
import { create } from '../api/data'
const ttn = require('ttn')

// https://www.thethingsnetwork.org/docs/applications/nodejs/quick-start.html
export default function InitMQTTClient (knex, APPS) {
  console.log(`connecting to ${JSON.stringify(APPS, null, 2)}`)
  _.map(APPS, app => {
    ttn.data(app[0], app[1])
      .then(client => {
        client.on('uplink', async (devID, payload) => {
          try {
            await create(payload, payload.metadata.time, knex)
            await knex('metadata').insert({
              app_id: payload.app_id,
              dev_id: payload.dev_id,
              time: payload.metadata.time,
              metadata: JSON.stringify(payload.metadata)
            })
          } catch (err) {
            console.error(err)
          }
        })
      })
      .catch(error => {
        console.error(`Connecting to app: ${app[0]} failed!`)
        console.error(error)
        process.exit(1)
      })
  })
}
