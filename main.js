import app from './app';
import rp from 'request-promise';
import config from './config.js';

const server = app(rp, config.TELEMETRY_API_URL);

server.start((err) => {
  if (err) {
    throw err;
  }
  console.log('Server running at:', server.info.uri);
});

module.exports = server;
