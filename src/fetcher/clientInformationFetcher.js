import config from '../config';

class ClientInformationFetcher {
  constructor(httpClient) {
    this.httpClient = httpClient;
  }

  whoAmI(authorizationHeader) {
    const request = {
      url: `${config.IAM_API_URL}/whoAmI`,
      method: 'GET',
      headers: {
        Authorization: authorizationHeader,
        'cache-control': 'no-cache'
      },
      timeout: config.TIMEOUT
    };

    return this.httpClient(request);
  }
}

module.exports = ClientInformationFetcher;
