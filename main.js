import app from './src/app';
import bunyan from 'bunyan';
import config from './src/config';
import httpClient from 'request-promise';
import CanVariablesFetcher from './src/fetchers/canVariables';
import EquipmentFetcher from './src/fetchers/equipment';
import TrackingPointFetcher from './src/fetchers/trackingPoints';
import UserInfoFetcher from './src/fetchers/userInfo';

const canVariablesFetcher = new CanVariablesFetcher(httpClient);
const equipmentFetcher = new EquipmentFetcher(httpClient);
const trackingPointFetcher = new TrackingPointFetcher(httpClient);
const userInfoFetcher = new UserInfoFetcher(httpClient);
const logger = bunyan.createLogger({
  name: 'fuse-equipment-api',
  streams: [{
    level: 'info',
    path: 'monitoring/log/equipment-api.log'
  }]
});

const server = app(equipmentFetcher,
                   canVariablesFetcher,
                   trackingPointFetcher,
                   userInfoFetcher,
                   logger);

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
