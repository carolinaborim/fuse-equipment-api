import './helpers.js';

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
        informations: {
          ENGINE_HOURS: '100',
          ENGINE_SPEED: '100'
        }
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

    it('request telemetry api and receiving equipments', (done) => {
      telemetryRequest = {
        method: 'GET',
        json: true,
        url: `${FUSE_TELEMETRY_API_URL}/equipment`,
        headers: {
          Authorization: authenticationHeader
        }
      };

      let telemetryReponse = {
        "meta": {
          "aggregations": {
            "equip_agg": [
              {
                "key": "a-equipment-id-1",
                "spn_ag": [
                  {
                    "key": "ENGINE_HOURS",
                    "spn_latest_ag": [
                      {
                        "raw": 94774,
                        "value": "100"
                      }
                    ]
                  },
                  {
                    "key": "ENGINE_SPEED",
                    "spn_latest_ag": [
                      {
                        "raw": 13279,
                        "value": "100"
                      }
                    ]
                  }
                ]
              },
              {
                "key": "a-equipment-id-2",
                "spn_ag": [
                  {
                    "key": "ENGINE_HOURS",
                    "spn_latest_ag": [
                      {
                        "raw": 94774,
                        "value": "100"
                      }
                    ]
                  },
                  {
                    "key": "ENGINE_SPEED",
                    "spn_latest_ag": [
                      {
                        "raw": 13279,
                        "value": "100"
                      }
                    ]
                  }
                ]
              }
            ]
          }
        }
      }

      let mockedSearchUri = 'https://agco-fuse-trackers-sandbox.herokuapp.com/trackingData/search?include=trackingPoint&links.canVariable.name=ENGINE_HOURS,ENGINE_SPEED,DRIVING_DIRECTION&aggregations=equip_agg&equip_agg.property=links.trackingPoint.equipment.id&equip_agg.aggregations=spn_ag%2Ctp_latest_ag&spn_ag.property=links.canVariable.name&spn_ag.aggregations=spn_latest_ag&spn_latest_ag.type=top_hits&spn_latest_ag.sort=-links.trackingPoint.timeOfOccurrence&spn_latest_ag.limit=1&spn_latest_ag.include=canVariable%2CcanVariable.standardUnit&tp_latest_ag.type=top_hits&tp_latest_ag.sort=-links.trackingPoint.timeOfOccurrence&tp_latest_ag.limit=1&tp_latest_ag.fields=links.trackingPoint&tp_latest_ag.include=trackingPoint&links.trackingPoint.equipment.id=a-equipment-id-1,a-equipment-id-2';

      respondWithSuccess(httpClient({
        method: 'GET',
        json: true,
        uri: mockedSearchUri,
        headers: {
          'Authorization': authenticationHeader
        }
      }), telemetryReponse);

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

      let telemetryReponse = {
        "meta": {
          "aggregations": {
            "equip_agg": [
              {
                "key": "1-2-3-a",
                "spn_ag": [
                  {
                    "key": "ENGINE_HOURS",
                    "spn_latest_ag": [
                      {
                        "raw": 94774,
                        "value": "100"
                      }
                    ]
                  },
                  {
                    "key": "ENGINE_SPEED",
                    "spn_latest_ag": [
                      {
                        "raw": 13279,
                        "value": "100"
                      }
                    ]
                  }
                ]
              }
            ]
          }
        }
      }

      let expectedResponse = {
        '1-2-3-a': {
          'ENGINE_HOURS': '17059320',
          'ENGINE_SPEED': '1659.875'
        }
      }

      let mockedSearchUri = 'https://agco-fuse-trackers-sandbox.herokuapp.com/trackingData/search?include=trackingPoint&links.canVariable.name=ENGINE_HOURS,ENGINE_SPEED,DRIVING_DIRECTION&aggregations=equip_agg&equip_agg.property=links.trackingPoint.equipment.id&equip_agg.aggregations=spn_ag%2Ctp_latest_ag&spn_ag.property=links.canVariable.name&spn_ag.aggregations=spn_latest_ag&spn_latest_ag.type=top_hits&spn_latest_ag.sort=-links.trackingPoint.timeOfOccurrence&spn_latest_ag.limit=1&spn_latest_ag.include=canVariable%2CcanVariable.standardUnit&tp_latest_ag.type=top_hits&tp_latest_ag.sort=-links.trackingPoint.timeOfOccurrence&tp_latest_ag.limit=1&tp_latest_ag.fields=links.trackingPoint&tp_latest_ag.include=trackingPoint&links.trackingPoint.equipment.id=1-2-3-a';

      respondWithSuccess(httpClient({
        method: 'GET',
        json: true,
        uri: mockedSearchUri,
        headers: {
          'Authorization': authenticationHeader
        }
      }), telemetryReponse);
    });

    it('handles an integration point failure smoothly even if it is an HTML page', (done) => {
      const expectedResponse = {
        errors: [{
          status: 404,
          href: 'about:blank',
          details: 'details...',
          title: '<!DOCTYPE html>\n<html>\n<body>\nHeroku App Not Found!\n</body>\n</html>'
        }]
      };

      respondWithFailure(httpClient(telemetryRequest), {
        response: {
          statusCode: 404,
          headers: { 'content-type': 'text/html' },
          body: {
            errors: [{
              status: 404,
              href: 'about:blank',
              details: 'details...',
              title: '<!DOCTYPE html>\n<html>\n<body>\nHeroku App Not Found!\n</body>\n</html>'
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

    it('handles an integration point failure smoothly even if it is a JSON object', (done) => {
      const expectedResponse = {
        errors: [{
          status: 404,
          title: '{ errors: [{ status: 404 }] }'
        }]
      };

      respondWithFailure(httpClient(telemetryRequest), {
        response: {
          statusCode: 404,
          headers: { 'content-type': 'application/json' },
          body: {
            errors: [{
              status: 404,
              details: 'details...',
              href: 'about:blank',
              title: '{ errors: [{ status: 404 }] }'
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

    it('get request equipment id that does not exist', (done) => {
      const expectedResponse = {
        errors: [{
          status: 404,
          href: 'about:blank',
          title: 'Resource not found.'
        }]
      };

      respondWithFailure(httpClient(telemetryRequest), {
        response: {
          statusCode: 404,
          body: {
            errors: [{
              status: 404,
              href: 'about:blank',
              title: 'Resource not found.'
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
            title: 'An unhandled error occurred'
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
