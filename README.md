# FUSE Equipment API

[![Build Status](https://travis-ci.org/agco-fuse/fuse-equipment-api.svg?branch=master)](https://travis-ci.org/agco-fuse/fuse-equipment-api)
[![Code Climate](https://codeclimate.com/github/agco-fuse/fuse-equipment-api/badges/gpa.svg)](https://codeclimate.com/github/agco-fuse/fuse-equipment-api)
[![License](https://img.shields.io/github/license/mashape/apistatus.svg?maxAge=2592000)](https://github.com/agco-fuse/fuse-equipment-api/blob/master/LICENSE)

This is an API that consumes the AGCO's Telemetry API, and exposes the Equipament information as a JSON RESTful endpoint.
It is developed on top of [node.js](https://nodejs.org).

# Executing

The API is requires [node.js](https://nodejs.org/) to be executed, and a C compiler to install some libraries with native bindings.

To start a webserver on a given port, execute the following:

```bash
npm install # Ensures that dependencies are installed
PORT=1234 npm start
```

The server will be running at: http://0.0.0.0:1234

## Developing

The API is requires [node.js](https://nodejs.org/) to be developed.

To start the development server, you can execute:

```bash
npm install # Ensures that dependencies are installed
npm run start-dev
```

This will start a server listening on http://localhost:9090 and will reload the
server when it noticies file changes.

The codebase contains tests, and to validate changes, you may execute:

```bash
npm install # Ensures that dependencies are installed
npm test # Triggers package analisys, lints and tests
```
