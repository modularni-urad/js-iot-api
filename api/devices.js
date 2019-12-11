import axios from 'axios'
import _ from 'underscore'

export function deviceManager (TTNApps) {
  return {
    list: (app) => {
      return app
        ? _getDevices(app, _.find(TTNApps, i => i[0] === app))
        : _getAllDevices(TTNApps)
    }
  }
}

function _getAllDevices (apps) {
  return Promise.all(_.map(apps, i => _getDevices(i[0], i[1])))
    .then(ress => {
      return _.reduce(ress, (acc, i) => {
        return _.union(acc, i)
      }, [])
    })
}

// https://www.thethingsnetwork.org/docs/applications/manager/
function _getDevices (app, key) {
  const url = `http://eu.thethings.network:8084/applications/${app}/devices`
  const opts = { headers: { 'Authorization': `Key ${key}` } }
  return axios.get(url, opts)
    .then(res => {
      return _.map(res.data.devices, i => (_.omit(i, 'lorawan_device')))
    })
    .catch(err => {
      console.error(`Fail to open: ${url}`)
      throw err
    })
}
