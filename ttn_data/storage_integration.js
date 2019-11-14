import axios from 'axios'
import _ from 'underscore'

const MIN = 60 * 1000
const INTERVAL = 1

// https://www.thethingsnetwork.org/docs/applications/storage/api.html
export function InitStorageIntegration (knex) {
  try {
    const APPS = JSON.parse(process.env.TTN_APPS)
    console.log(`connecting to ${JSON.stringify(APPS, null, 2)}`)
    _.map(APPS, app => {
      _loadAppData(app[0], app[1], '7d', knex) // load all data @ the beginning
      setInterval(() => {
        // load each hour the diff
        _loadAppData(app[0], app[1], `${INTERVAL + 1}m`, knex)
      }, INTERVAL * MIN)
    })
  } catch (e) {
    console.error('!!! env.TTN_APPS must be set to JSON array !!!')
    throw e
  }
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
          found.length === 0 && knex('envirodata').insert(data).catch(err => {
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
