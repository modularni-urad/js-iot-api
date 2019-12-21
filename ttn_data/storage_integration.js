import axios from 'axios'
import _ from 'underscore'
require('dotenv').config()

const MIN = 60 * 1000
const INTERVAL = 1
const DATA_HOOK_URL = process.env.DATA_HOOK_URL

// https://www.thethingsnetwork.org/docs/applications/storage/api.html
export function InitStorageIntegration (knex, apps) {
  _.map(apps, app => {
    _loadAppData(app[0], app[1], '7d', knex) // load all data @ the beginning
    setInterval(() => {
      // load each minute the diff
      _loadAppData(app[0], app[1], `${INTERVAL + 1}m`, knex)
    }, INTERVAL * MIN)
  })
}

function _loadAppData (app, key, last, knex) {
  //
  function _processResultItem (item) {
    const payload = _.omit(item, ['device_id', 'raw', 'time'])
    _.map(payload, (v, k) => {
      const data = {
        typ: k,
        value: v,
        dev_id: item.device_id,
        app_id: app,
        time: item.time
      }
      // try to get existing
      knex('envirodata').where(_.omit(data, 'value')).select('value')
        .then(found => {
          // in case no existing, insert ..
          found.length === 0 && knex('envirodata').insert(data)
            .then(() => {
              // send new data integration request
              return axios.put(DATA_HOOK_URL, data)
            })
            .catch(err => {
              console.error(err)
            })
        })
    })
  }

  axios.get(`https://${app}.data.thethingsnetwork.org/api/v2/query?last=${last}`, {
    headers: { 'Authorization': `key ${key}` }
  }).then(res => {
    res.status === 200 && _.map(res.data, i => _processResultItem(i))
  })
    .catch(err => console.error(err))
}
