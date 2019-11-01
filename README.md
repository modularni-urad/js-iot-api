

## settings

- env.TTN_APPS: setting this env var will cause usage [ttn api usage](https://www.thethingsnetwork.org/docs/applications/nodejs/quick-start.html).
Format: JSON array of array with 2 items: 1st - app name, 2nd - app secret:

```
TTN_APPS=[["app1","ttn-account-v2.sdkfwokjfdsojfowwkjfwof"]]
```
- env.IOT_API_KEYS: this enables integration route.
Format: JSON array of strings.
```
IOT_API_KEYS=["fkjslfjowefj", "fskodfjsookf"]
```
- env.DATABASE_URL: connection string (currently to postgre db)
- env.PORT: port to bind to
