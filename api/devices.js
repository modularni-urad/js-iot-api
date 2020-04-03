import axios from 'axios'
import _ from 'underscore'
import { whereFilter } from 'knex-filter-loopback'

export function findDevices (cond, knex) {
  try {
    const filter = JSON.parse(cond.filter)
    return knex('devices').where(whereFilter(filter))
  } catch {
    throw new Error('wrong filter')
  }
}

function getDeviceInfo (appId, devId, TTNApps) {
  const appInfo = _.find(TTNApps, i => i[0] === appId)
  return _getDevices(appInfo)
    .then(devs => {
      return _.find(devs, i => i.dev_id === devId)
    })
}

export function createDevice (appId, devId, knex, TTNApps) {
  return getDeviceInfo(appId, devId, TTNApps)
    .then(devInfo => {
      return knex('devices').insert(devInfo).returning('id')
    })
    .then(results => {
      return results[0]
    })
}

// https://www.thethingsnetwork.org/docs/applications/manager/
function _getDevices (appInfo) {
  const app = appInfo[0]
  const key = appInfo[1]
  const url = `http://eu.thethings.network:8084/applications/${app}/devices`
  const opts = { headers: { Authorization: `Key ${key}` } }
  return axios.get(url, opts)
    .then(res => {
      return _.map(res.data.devices, i => (_.omit(i, 'lorawan_device')))
    })
    .catch(err => {
      console.error(`Fail to open: ${url}`)
      throw err
    })
}
