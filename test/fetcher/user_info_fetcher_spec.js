import config from '../../src/config';
import UserInfoFetcher from '../../src/fetcher/userInfoFetcher';
import td from 'testdouble';
import helpers from '../helpers';

describe('UserInfoFetcher', () => {
  it('fetches user information', (done) => {
    const authenticationHeader = 'Basic ???';
    const httpClient = td.function();
    const userInfoResponse = {
      serviceUsers: [{
        id: 'fake-id',
        emailAddress: 'user@example.com',
        status: 'active',
        links: {
          roles: ['fake-role']
        }
      }]
    };

    const userInfoRequest = {
      url: `${helpers.IAM_API_URL}/whoAmI`,
      method: 'GET',
      headers: {
        Authorization: authenticationHeader,
        'cache-control': 'no-cache'
      },
      timeout: config.TIMEOUT
    };

    helpers.respondWithSuccess(httpClient(userInfoRequest), userInfoResponse);

    const userInfoFetcher = new UserInfoFetcher(httpClient);
    userInfoFetcher.whoAmI(authenticationHeader)
      .then((data) => {
        expect(data).to.be.eql(userInfoResponse);
      })
      .then(done);
  });
});
