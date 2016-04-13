describe('EquipmentController', () => {
  let authenticationHeader = null;
  let options = {};
  let telemetryRequest = {};

  const generateFacadeEquipment = (equipmentId) => {
    return {
      type: 'equipment',
      id: equipmentId,
      attributes: {
        description: 'Equipment 1',
        serviceLevel: 1,
        identificationNumber: 'a-identification-number',
        manufacturingDate: '2014-06-30T15:18:51.000Z',
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
    };
  };

  const generateTelemetryEquipment = (equipmentId) => {
    return {
      id: equipmentId,
      description: 'Equipment 1',
      serviceLevel: 1,
      identificationNumber: 'a-identification-number',
      manufacturingDate: '2014-06-30T15:18:51.000Z',
      links: {
        dealer: 'a-dealer-id',
        model: 'a-model-id'
      }
    };
  };

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

      telemetryRequest = {
        method: 'GET',
        json: true,
        url: `${FUSE_TELEMETRY_API_URL}/equipment`,
        headers: {
          Authorization: authenticationHeader
        }
      };
    });

    it('request telemetry api with same authorization header', (done) => {
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

    it('request telemetry api and receiving equipments', (done) => {
      const expectedResponse = {
        data: [
          generateFacadeEquipment('a-equipment-id-1'),
          generateFacadeEquipment('a-equipment-id-2')
        ]
      };

      respondWithSuccess(httpClient(telemetryRequest), {
        equipment: [
          generateTelemetryEquipment('a-equipment-id-1'),
          generateTelemetryEquipment('a-equipment-id-2')
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

      telemetryRequest = {
        method: 'GET',
        json: true,
        url: `${FUSE_TELEMETRY_API_URL}/equipment/${equipmentId}`,
        headers: {
          Authorization: authenticationHeader
        }
      };
    });

    it('get request equipment by id with successful authorization header', (done) => {
      const expectedResponse = {
        data: generateFacadeEquipment(equipmentId)
      };

      respondWithSuccess(httpClient(telemetryRequest), {
        equipment: [generateTelemetryEquipment(equipmentId)],
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

    it('get request status code diferent from any mapped error', (done) => {
      const expectedResponse = {
        errors: [
          {
            status: 500,
            title: 'An unhandle error happened',
          }
        ]
      };

      respondWithFailure(httpClient(telemetryRequest), {
        response: {
          statusCode: 123,
          body: 'Error'
        }
      });

      server.inject(options, (res) => {
        expect(res.statusCode).to.be.eql(500);
        expect(JSON.parse(res.payload)).to.be.eql(expectedResponse);
        done();
      });
    });
  });
});
