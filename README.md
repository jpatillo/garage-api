# Garage Server

The backend for our garage door opener.

Why do we need a backend? Security mostly. Originally there was simply a Raspberry Pi Zero W, a Mosquitto broker, and an Android app. The Android app published a request through Mosquitto to have the Raspberry Pi activate a relay that signaled the garage door to open.

## Technologies

- node.js
  - express
- firebase
- MQTT

## TODO

- Find out the lifecycle of a MQTT client.
- Save logs to a database for debugging.
- Save telemetry to a database and allow it to be read from the Android app
- User accounts with access to specific devices.
