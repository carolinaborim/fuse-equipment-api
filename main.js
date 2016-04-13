import app from './app';
import rp from 'request-promise';

const FUSE_TELEMETRY_API_URL = process.env.FUSE_TELEMTRY_API_URL || 'https://agco-fuse-trackers-sandbox.herokuapp.com';
const server = app(rp, FUSE_TELEMETRY_API_URL);

server.start((err) => {
  if (err) {
    throw err;
  }
  console.log('Server running at:', server.info.uri);
});

module.exports = server;
