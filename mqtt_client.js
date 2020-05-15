import axios from 'axios'
import _ from 'underscore'
import { TNAMES } from './consts'
const ttn = require('ttn')
const activeApps = {}

export function appStop (appId) {
  if (appId in activeApps) {
    console.log(`disconnecting ${appId}`)
    activeApps[appId].close()
    delete activeApps[appId]
  }
}

// https://www.thethingsnetwork.org/docs/applications/nodejs/quick-start.html
export function appStart (app, knex) {
  console.log(`connecting to ${app.app_id}`)

  function _setError (error) {
    return knex(TNAMES.APPS).where({ app_id: app.app_id }).update({ error })
      .catch(console.error)
  }

  function onUplink (devID, payload) {
    const data = _.pick(payload, ['app_id', 'dev_id', 'payload_fields'])
    data.time = payload.metadata.time

    // send data integration request
    axios.post(app.endpoint, data, { timeout: 2000 })
      .catch(err => {
        return _setError(`INTEGRATION: ${app.endpoint}, ${err.toString()}`)
      })

    const metadata = _.pick(payload, ['app_id', 'dev_id'])
    metadata.time = payload.metadata.time
    metadata.metadata = JSON.stringify(_.omit(payload.metadata, 'time'))
    knex('metadata').insert(metadata).catch(console.error)
  }

  ttn.data(app.app_id, app.app_secret)
    .then(client => {
      client.on('uplink', onUplink)
      activeApps[app.app_id] = client
      return _setError(null)
    })
    .catch(err => {
      _setError(`TTN: ${err.toString()}`)
    })
}
