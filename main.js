import app from './app';
import config from './config';
import httpClient from 'request-promise';
import CanVariablesFetcher from './fetcher/canVariablesFetcher';
import EquipmentFetcher from './fetcher/equipmentFetcher';
import TrackingPointFetcher from './fetcher/trackingPointFetcher';

const canVariablesFetcher = new CanVariablesFetcher(httpClient);
const equipmentFetcher = new EquipmentFetcher(httpClient);
const trackingPointFetcher = new TrackingPointFetcher(httpClient);
const server = app(equipmentFetcher, canVariablesFetcher, trackingPointFetcher);

server.start((err) => {
  if (err) {
    throw err;
  }
  if (server.info && server.info.url) {
    console.log(`Server running at: ${server.info.url}`);
  } else {
    console.log(`Server running at: http://127.0.0.1:${config.PORT}`);
  }
});

module.exports = server;
