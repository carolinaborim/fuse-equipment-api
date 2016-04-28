import config from '../config';

class EquipmentFetcher {
  constructor(httpClient) {
    this.telemetryAPI = config.TELEMETRY_API_URL;
    this.httpClient = httpClient;
  }

  findAll(offset, limit, authorizationBearer) {
    const request = {
      url: `${this.telemetryAPI}/equipment?offset=${offset}&limit=${limit}`,
      method: 'GET',
      json: true,
      headers: {
        Authorization: authorizationBearer
      },
      timeout: config.TIMEOUT
    };

    return this.httpClient(request);
  }

  findById(id, authorizationBearer) {
    const request = {
      url: `${this.telemetryAPI}/equipment/${id}`,
      method: 'GET',
      json: true,
      headers: {
        Authorization: authorizationBearer
      },
      timeout: config.TIMEOUT
    };

    return this.httpClient(request);
  }
}

module.exports = EquipmentFetcher;
