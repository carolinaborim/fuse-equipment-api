describe('EquipmentController', () => {
  let authenticationHeader = null;
  let options = {};

  before(() => {
    authenticationHeader = 'Bearer VALID_TOKEN';
  });

  describe('Route: equipment', () => {
    before(() => {
      options = {
        url: '/equipment',
        method: 'GET',
        headers: {
          Authorization: authenticationHeader
        }
      };
    });

    it('request telemetry api with same authorization header', (done) => {
      const telemetryRequest = {
        method: 'GET',
        json: true,
        url: `${FUSE_TELEMETRY_API_URL}/equipment`,
        headers: {
          Authorization: authenticationHeader
        }
      };

      respondWithSuccess(httpClient(telemetryRequest), {
        equipment: [],
        links: {}
      });

      server.inject(options, (res) => {
        expect(res.statusCode).to.be.eql(200);
        td.verify(httpClient(telemetryRequest));
        done();
      });
    });

    it('request telemetry api and receiving at least one equipment', (done) => {
      const telemetryRequest = {
        method: 'GET',
        json: true,
        url: `${FUSE_TELEMETRY_API_URL}/equipment`,
        headers: {
          Authorization: authenticationHeader
        }
      };
      const expectedResponse = {
        data: [{
          type: 'equipment',
          id: 'a-equipment-id',
          attributes: {
            description: "Equipment 1",
            serviceLevel: 1,
            identificationNumber: "a-identification-number",
            manufacturingDate: "2014-06-30T15:18:51.000Z",
          },
          relationships: {
            dealer: {
              links: {
                self: '',
                related: ''
              },
              data: {
                type: 'dealer',
                id: 'a-dealer-id'
              }
            },
            model: {
              links: {
                self: '',
                related: ''
              },
              data: {
                type: 'model',
                id: 'a-model-id'
              }
            }
          }
        }]
      };

      respondWithSuccess(httpClient(telemetryRequest), {
        equipment: [
          {
            id: "a-equipment-id",
            description: "Equipment 1",
            serviceLevel: 1,
            identificationNumber: "a-identification-number",
            manufacturingDate: "2014-06-30T15:18:51.000Z",
            links: {
              dealer: "a-dealer-id",
              model: "a-model-id"
            }
          }
        ],
        links: {}
      });

      server.inject(options, (res) => {
        expect(res.statusCode).to.be.eql(200);
        expect(JSON.parse(res.payload)).to.be.eql(expectedResponse);
        done();
      });
    });

    it('request telemetry api with same authorization header and get an error', (done) => {
      const telemetryRequest = {
        method: 'GET',
        json: true,
        url: `${FUSE_TELEMETRY_API_URL}/equipment`,
        headers: {
          Authorization: authenticationHeader
        }
      };

      respondWithFailure(httpClient(telemetryRequest), {
        response: {
          statusCode: 401,
          body: 'Unauthorized'
        }
      });

      server.inject(options, (res) => {
        expect(res.statusCode).to.be.eql(401);
        expect(JSON.parse(res.payload)).to.be.eql({
          errors: [
            {
              status: 401,
              title:  'Unauthorized'
            }
          ]
        });
        td.verify(httpClient(telemetryRequest));
        done();
      });
    });
  });

  describe('Route: equipment/<id>', () => {
    let equipmentId = '1-2-3-a';

    before(() => {
      options = {
        url: `/equipment/${equipmentId}`,
        method: 'GET',
        headers: {
          Authorization: authenticationHeader
        }
      };
    });

    it('get request equipment by id with successful authorization header', (done) => {
      const expectedResponse = {
        data: {
          type: 'equipment',
          id: equipmentId,
          attributes: {
            description: "Equipment 1",
            serviceLevel: 1,
            identificationNumber: "a-identification-number",
            manufacturingDate: "2014-06-30T15:18:51.000Z",
          },
          relationships: {
            dealer: {
              links: {
                self: '',
                related: ''
              },
              data: {
                type: 'dealer',
                id: 'a-dealer-id'
              }
            },
            model: {
              links: {
                self: '',
                related: ''
              },
              data: {
                type: 'model',
                id: 'a-model-id'
              }
            }
          }
        }
      };

      const telemetryRequest = {
        method: 'GET',
        json: true,
        url: `${FUSE_TELEMETRY_API_URL}/equipment/${equipmentId}`,
        headers: {
          Authorization: authenticationHeader
        }
      };

      respondWithSuccess(httpClient(telemetryRequest), {
        equipment: [
          {
            id: equipmentId,
            description: "Equipment 1",
            serviceLevel: 1,
            identificationNumber: "a-identification-number",
            manufacturingDate: "2014-06-30T15:18:51.000Z",
            links: {
              dealer: "a-dealer-id",
              model: "a-model-id"
            }
          }
        ],
        links: {}
      });

      server.inject(options, (res) => {
        expect(res.statusCode).to.be.eql(200);
        expect(JSON.parse(res.payload)).to.be.eql(expectedResponse);
        done();
      });
    });

    it('get request equipment id that does not exist', (done) => {
      const expectedResponse = {
        errors: [
          {
            status: 404,
            title: 'Resource not found.',
          }
        ]
      };
      const telemetryRequest = {
        method: 'GET',
        json: true,
        url: `${FUSE_TELEMETRY_API_URL}/equipment/${equipmentId}`,
        headers: {
          Authorization: authenticationHeader
        }
      };

      respondWithFailure(httpClient(telemetryRequest), {
        response: {
          statusCode: 404,
          body: {
            errors: [{
              status: 404,
              href: 'about:blank',
              title: 'Resource not found.',
              detail: ''
            }]
          }
        }
      });

      server.inject(options, (res) => {
        expect(res.statusCode).to.be.eql(404);
        expect(JSON.parse(res.payload)).to.be.eql(expectedResponse);
        done();
      });
    });
  });
});
