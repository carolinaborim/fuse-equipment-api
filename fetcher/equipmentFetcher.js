import config from '../config';

class EquipmentFetcher {
  constructor(httpClient) {
    this.telemetryAPI = config.TELEMETRY_API_URL;
    this.httpClient = httpClient;
  }
}

module.exports = EquipmentFetcher;
