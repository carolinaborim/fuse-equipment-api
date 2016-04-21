import app from './app';
import rp from 'request-promise';
import config from './config.js';
import CanVariablesFetcher from './fetcher/canVariablesFetcher';

const canVariablesFetcher = new CanVariablesFetcher(rp);
const equipmentFetcher = new EquipmentFetcher(rp);
const server = app(equipmentFetcher, canVariablesFetcher);

server.start((err) => {
  if (err) {
    throw err;
  }
  console.log('Server running at:', server.info.uri);
});

module.exports = server;
