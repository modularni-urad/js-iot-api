# js-iot-api

IOT data sever connected to TTN infrastructure serving data via http api.
Written in javascript => require [node.js and npm](https://nodejs.org/en/) to run.

![Schema](https://www.plantuml.com/plantuml/svg/VLFBRi8m4BpxArRSGrLnGQX2HEHGL5fUwQb2o2GcSflOhks0KCM_T-qa996gvfBrpknhrfuPIxKjYvmGostEuDC4NDg0AWu1p6MXf632GiHffcb124sir12c1HUrFOYefKWLfYoO7W0raA8dgHq4Y90fWq4SlmtWXm1-7w-RE8QjB2tJUnTGcHKMAfNpX5gE2U01KdRc2JEUXYaGDUH6wfoBLGmxfi-kRfMwzKSo-M8Qi0zBkMWPRGD9pd4sdzcTv_xOSiBrmcEeXNVUEWNMqjXCizrc-MyT9yIHcbv05_Trc3XpBHrrtmUQqVlUWbdQ9z_gzkwoZ7GA2lTwlGkUoumdVXh4rWvoRBz6279sii6qKNVY33VEYMT3zpSIxyM57L48HVp5g0EwQvx0TydqbRH2Gb0g95MhdO2IsiBZU3pgKQRtVf2X9KvhXgZ7C0hZyF2yMhqSthVBNaGgBmB3Mj7-Gclb_e8Q-VmaJq4tKUrfWicCYHIVnYy0)

## settings

Is done via following environment variables:

- TTN_APPS: JSON array of array with 2 items: 1st - app name, 2nd - app secret:
```
TTN_APPS=[["app1","ttn-account-v2.sdkfwokjfdsojfowwkjfwof"]]
```
- DATA_HOOK_URL: url that PUT request on a new data is send to
- DATABASE_URL: connection string (currently to postgre db)
- PORT: port to bind to

## test

Rename env.sample -> .env and edit it appropriately with your own values.
For testing purposes you can use sqlite DB byt setting:

```
DATABASE_URL=db.sqlite
```

Then run:

```
npm i
npm start
```

### Production deploy

For production deploy use [Dockerfile](./Dockerfile).

## usage

Data can be queried via API that supports [loopback.io like where filter](https://loopback.io/doc/en/lb2/Where-filter).
The contition is a JSON specifying values for search, e.g. following sample:
```
FILTER='{"devid":1,"typ":"temp","time":{">":"2019-11-20T16:32:52.200Z"}}'
URL="http://data.mutabor.cz:2300/data?filter=$FILTER"
wget -qO - $URL | json_pp
```
Queries temperature (temp) data from device with id:1 that are older than 2019-11-20T16:32:52.200Z.

You can use fields param for specifying which fields you want to get.
E.g. only value,time:
```
URL="http://data.mutabor.cz/data?filter=$FILTER&fields=value,time"
wget -qO - $URL | json_pp
```

## integrations

To TTN infrastructure you can connect different ways
- MQTT client through [ttn api usage](https://www.thethingsnetwork.org/docs/applications/nodejs/quick-start.html), see [ttn/mqtt_client.js](ttn/mqtt_client.js).
In case you are behind a firewall (FW), you have to find you which ports to open.
The connection is made via gRPC.

OBSOLETE:
- [storage integration](https://www.thethingsnetwork.org/docs/applications/storage/api.html):
the data are stored in TTN storage __only for 7days__ -> regular download is performed: see [ttn/storage_integration.js](ttn/storage_integration.js).
- [HTTP integration](https://www.thethingsnetwork.org/docs/applications/http/):
It needs to add another POST route to API and let TTN call this endpoint.
FW issues detected so moved to storage integration.

## DB

[DB model](./migrations/) is as simple as possible.
It reflects fact, that each sensor sends periodically a value of a type.
In TTN sensor is identified by app_id and dev_id,
so there is [devices table](./migrations/20190403_devices.js) with autogen int id.

The [data DB schema](./migrations/20191023_envirodata.js) is following:
- devid: integer (foreign key to devices.id)
- typ: string
- value: float
- time: timestamp

Each message of each device can be split into particular values of different type with [Payload Format](https://www.youtube.com/watch?v=nT2FnwCoP7w).
Each device type must provide format of payload in documentation.

There is another table storing [metadata with LoRa network state](./migrations/20200402_metadata.js).
