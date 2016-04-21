import config from '../config';

class EquipmentFetcher {
  constructor(httpClient) {
    this.telemetryAPI = config.TELEMETRY_API_URL;
    this.httpClient = httpClient;
  }

  findAll(offset, limit, authorizationBearer) {
    return this.httpClient({
      method: 'GET',
      json: true,
      url: `${this.telemetryAPI}/equipment?offset=${offset}&limit=${limit}`,
      headers: {
        Authorization: authorizationBearer
      }
    })
  }

  findById(id, authorizationBearer) {
    return this.httpClient({
      method: 'GET',
      json: true,
      url: `${this.telemetryAPI}/equipment/${id}`,
      headers: {
        Authorization: authorizationBearer
      }
    })
  }
}

module.exports = EquipmentFetcher;
