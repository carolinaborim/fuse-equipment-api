describe('Route: equipment', () => {
  it('request telemetry api with same authorization header', (done) => {
    const authenticationHeader = 'Bearer VALID_TOKEN';
    const options = {
      url: '/equipment',
      method: 'GET',
      headers: {
        Authorization: authenticationHeader
      }
    };
    const telemetryRequest = {
      method: 'GET',
      json: true,
      url: `${FUSE_TELEMETRY_API_URL}/equipment`,
      headers: {
        Authorization: authenticationHeader
      }
    };

    respondWithSuccess(httpClient(telemetryRequest), {});

    server.inject(options, (res) => {
      expect(res.statusCode).to.be.eql(200);
      td.verify(httpClient(telemetryRequest));
      done();
    });
  });

  it('request telemetry api with same authorization header and get an error', (done) => {
    const authenticationHeader = 'Bearer INVALID_TOKEN';
    const options = {
      url: '/equipment',
      method: 'GET',
      headers: {
        Authorization: authenticationHeader
      }
    };
    const telemetryRequest = {
      method: 'GET',
      json: true,
      url: `${FUSE_TELEMETRY_API_URL}/equipment`,
      headers: {
        Authorization: authenticationHeader
      }
    };

    respondWithFailure(
      httpClient(telemetryRequest), {
        statusCode: 401,
        response: {
          body: {
            error: 'Unauthorized user'
          }
        }
    });

    server.inject(options, (res) => {
      expect(res.statusCode).to.be.eql(401);
      expect(JSON.parse(res.payload)).to.be.eql({error: 'Unauthorized user'});
      td.verify(httpClient(telemetryRequest));
      done();
    });
  });
});
