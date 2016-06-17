import app from './src/app';
import config from './src/config';
import httpClient from 'request-promise';
import CanVariablesFetcher from './src/fetcher/canVariablesFetcher';
import EquipmentFetcher from './src/fetcher/equipmentFetcher';
import TrackingPointFetcher from './src/fetcher/trackingPointFetcher';
import ClientInformationFetcher from './src/fetcher/clientInformationFetcher';

const canVariablesFetcher = new CanVariablesFetcher(httpClient);
const equipmentFetcher = new EquipmentFetcher(httpClient);
const trackingPointFetcher = new TrackingPointFetcher(httpClient);
const clientInformationFetcher = new ClientInformationFetcher(httpClient);
const server = app(equipmentFetcher,
                   canVariablesFetcher,
                   trackingPointFetcher,
                   clientInformationFetcher);

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
