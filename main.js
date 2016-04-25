import app from './app';
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
  console.log('Server running at:', server.info.uri);
});

module.exports = server;
