import app from './app';
import rp from 'request-promise';
import CanVariablesFetcher from './fetcher/canVariablesFetcher';
import EquipmentFetcher from './fetcher/equipmentFetcher';
import TrackingPointFetcher from '../fetcher/trackingPointFetcher';

const canVariablesFetcher = new CanVariablesFetcher(rp);
const equipmentFetcher = new EquipmentFetcher(rp);
const trackingPointFetcher = new TrackingPointFetcher(rp);
const server = app(equipmentFetcher, canVariablesFetcher, trackingPointFetcher);

server.start((err) => {
  if (err) {
    throw err;
  }
  console.log('Server running at:', server.info.uri);
});

module.exports = server;
