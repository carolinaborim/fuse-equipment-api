import config from '../../src/config';
import ClientInformationFetcher from '../../src/fetcher/clientInformationFetcher';
import td from 'testdouble';
import helpers from '../helpers';

describe('ClientInformationFetcher', () => {
  it('fetches client information', (done) => {
    const authenticationHeader = 'Basic ???';
    const httpClient = td.function();
    const clientInformationResponse = {
      serviceUsers: [{
        id: 'fake-id',
        emailAddress: 'user@example.com',
        status: 'active',
        links: {
          roles: ['fake-role']
        }
      }]
    };

    const clientInformationRequest = {
      url: `${helpers.IAM_API_URL}/whoAmI`,
      method: 'GET',
      headers: {
        Authorization: authenticationHeader,
        'cache-control': 'no-cache'
      },
      timeout: config.TIMEOUT
    };

    helpers.respondWithSuccess(httpClient(clientInformationRequest), clientInformationResponse);

    const clientInformationFetcher = new ClientInformationFetcher(httpClient);
    clientInformationFetcher.whoAmI(authenticationHeader)
      .then((data) => {
        expect(data).to.be.eql(clientInformationResponse);
      })
      .then(done);
  });
});
