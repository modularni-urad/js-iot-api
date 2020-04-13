import _ from 'underscore'
import { create } from './api/data'
import { createDevice } from './api/devices'
const ttn = require('ttn')

// https://www.thethingsnetwork.org/docs/applications/nodejs/quick-start.html
export default function InitMQTTClient (knex, APPS) {
  console.log(`connecting to ${JSON.stringify(APPS, null, 2)}`)
  _.map(APPS, app => {
    ttn.data(app[0], app[1])
      .then(client => {
        client.on('uplink', async (devID, payload) => {
          try {
            const appId = payload.app_id
            const existingDev = await knex('devices').where({
              dev_id: devID,
              app_id: appId
            }).first('id')
            const devid = existingDev
              ? existingDev.id
              : await createDevice(appId, devID, knex, APPS)
            const time = payload.metadata.time
            await create(devid, payload.payload_fields, time, knex)
            await knex('metadata').insert({
              devid,
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
