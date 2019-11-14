
## integrations

To TTN infrastructure you can connect different ways:
- [storage integration](https://www.thethingsnetwork.org/docs/applications/storage/api.html):
the data are stored in TTN storage __only for 7days__ -> regular download is performed: see [ttn/storage_integration.js](ttn/storage_integration.js).
- MQTT client through [ttn api usage](https://www.thethingsnetwork.org/docs/applications/nodejs/quick-start.html), see [ttn/mqtt_client.js](ttn/mqtt_client.js).
In case you are behind a firewall (FW), you have to find you which ports to open.
The connection is made via gRPC.
- [HTTP integration](https://www.thethingsnetwork.org/docs/applications/http/):
It needs to add another POST route to API and let TTN call this endpoint.
FW issues detected so moved to storage integration.

## settings

- env.TTN_APPS: JSON array of array with 2 items: 1st - app name, 2nd - app secret:
```
TTN_APPS=[["app1","ttn-account-v2.sdkfwokjfdsojfowwkjfwof"]]
```
- env.DATABASE_URL: connection string (currently to postgre db)
- env.PORT: port to bind to
