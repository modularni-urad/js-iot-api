# js-iot-api

IOT sever connected to TTN infrastructure routing data to appropriate https endpoints.
Stores LoRa network signal state - serves it via API for analysis.
Written in javascript => require [node.js and npm](https://nodejs.org/en/) to run.

![Schema](https://www.plantuml.com/plantuml/svg/VLFBRi8m4BpxArRSGrLnGQX2HEHGL5fUwQb2o2GcSflOhks0KCM_T-qa996gvfBrpknhrfuPIxKjYvmGostEuDC4NDg0AWu1p6MXf632GiHffcb124sir12c1HUrFOYefKWLfYoO7W0raA8dgHq4Y90fWq4SlmtWXm1-7w-RE8QjB2tJUnTGcHKMAfNpX5gE2U01KdRc2JEUXYaGDUH6wfoBLGmxfi-kRfMwzKSo-M8Qi0zBkMWPRGD9pd4sdzcTv_xOSiBrmcEeXNVUEWNMqjXCizrc-MyT9yIHcbv05_Trc3XpBHrrtmUQqVlUWbdQ9z_gzkwoZ7GA2lTwlGkUoumdVXh4rWvoRBz6279sii6qKNVY33VEYMT3zpSIxyM57L48HVp5g0EwQvx0TydqbRH2Gb0g95MhdO2IsiBZU3pgKQRtVf2X9KvhXgZ7C0hZyF2yMhqSthVBNaGgBmB3Mj7-Gclb_e8Q-VmaJq4tKUrfWicCYHIVnYy0)

## settings

Is done via following environment variables:

- DATABASE_URL: connection string (currently to postgre db)
- HOST: hostname to bind to (optional, default 127.0.0.1)
- PORT: port to bind to (optional, default 3000)

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

## TTN integration

TTN infrastructure is conntected via MQTT client - [ttn api usage](https://www.thethingsnetwork.org/docs/applications/nodejs/quick-start.html), see [ttn/mqtt_client.js](ttn/mqtt_client.js).
In case you are behind a firewall (FW), you have to find you which ports to open.
The connection is made via gRPC.

Each message of each device can be split into particular values of different type with [Payload Format](https://www.youtube.com/watch?v=nT2FnwCoP7w).
Each device type must provide format of payload in documentation.

## DB

[DB model](./migrations/) has 2 tables:
- [metadata](./migrations/20200402_metadata.js) for storing metadata of
delivered messages containing LoRa network state info necessary for signal
distribution analysis
- [apps](./migrations/20200514_apps.js) storing application properties.
