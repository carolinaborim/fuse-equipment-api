import './helpers.js';

describe('EquipmentController', () => {
  let authenticationHeader = null;
  let options = {};
  let telemetryRequest = {};

  const generateSearchUrl = (equipmentIds) => {
    return `https://agco-fuse-trackers-sandbox.herokuapp.com/trackingData/search?include=trackingPoint&links.canVariable.name=ENGINE_HOURS,ENGINE_SPEED,DRIVING_DIRECTION&aggregations=equip_agg&equip_agg.property=links.trackingPoint.equipment.id&equip_agg.aggregations=spn_ag%2Ctp_latest_ag&spn_ag.property=links.canVariable.name&spn_ag.aggregations=spn_latest_ag&spn_latest_ag.type=top_hits&spn_latest_ag.sort=-links.trackingPoint.timeOfOccurrence&spn_latest_ag.limit=1&spn_latest_ag.include=canVariable%2CcanVariable.standardUnit&tp_latest_ag.type=top_hits&tp_latest_ag.sort=-links.trackingPoint.timeOfOccurrence&tp_latest_ag.limit=1&tp_latest_ag.fields=links.trackingPoint&tp_latest_ag.include=trackingPoint&links.trackingPoint.equipment.id=${equipmentIds.join(',')}`;
  };
  
  const generateTrackingPointSearchUrl = (equipmentIds) => {
    return `https://agco-fuse-trackers-sandbox.herokuapp.com/trackingData/search?include=trackingPoint,trackingPoint.duty&aggregations=equip_agg&equip_agg.property=links.trackingPoint.equipment.id&equip_agg.aggregations=tp_latest_ag&tp_latest_ag.type=top_hits&tp_latest_ag.sort=-links.trackingPoint.timeOfOccurrence&tp_latest_ag.limit=1&tp_latest_ag.fields=links.trackingPoint&tp_latest_ag.include=trackingPoint&links.trackingPoint.equipment.id=${equipmentIds.join(',')}`  
  };
  
  const generateFacadeEquipment = (equipmentId) => {
    return readFixture('facadeEquipment', { id: equipmentId});
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
        url: '/equipments',
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

    it('should allow offset and limit pagination parameters', (done) => {
      const equipmentResponse = {
        equipment: [
          generateTelemetryEquipment('a-equipment-id-1'),
          generateTelemetryEquipment('a-equipment-id-2')
        ],
        links: {}
      };

      const equipmentRequest = {
        method: 'GET',
        json: true,
        url: `${FUSE_TELEMETRY_API_URL}/equipment?offset=11&limit=50`,
        headers: {
          Authorization: authenticationHeader
        }
      };
      respondWithSuccess(httpClient(equipmentRequest), equipmentResponse);

      const equipmentOne = generateFacadeEquipment('a-equipment-id-1');
      let equipmentTwo = generateFacadeEquipment('a-equipment-id-2');
      equipmentTwo.attributes.trackingPoint = {
        "location": {
          "coordinates": [
            0.9392138888888889,
            52.6362222,
            116
          ],
          "type": "Point"
        },
        "status": "STOPPEDIDLE"
      };

      respondWithSuccess(
        canVariablesFetcher.fetchByEquipmentId(['a-equipment-id-1', 'a-equipment-id-2'], authenticationHeader),
        {
          'a-equipment-id-1': { trackingData: equipmentOne.attributes.trackingData, trackingPoint: equipmentOne.attributes.trackingPoint },
          'a-equipment-id-2': { trackingData: equipmentTwo.attributes.trackingData, trackingPoint: equipmentTwo.attributes.trackingPoint }
        }
      );

      const expectedResponse = {
        data: [
          equipmentOne,
          equipmentTwo
        ]
      };

      const equipmentOffsetRequest = {
        url: '/equipments?offset=11&limit=50',
        method: 'GET',
        headers: {
          Authorization: authenticationHeader
        }
      };

      server.inject(equipmentOffsetRequest, (res) => {
        expect(res.statusCode).to.be.eql(200);
        expect(JSON.parse(res.payload)).to.be.eql(expectedResponse);
        done();
      });
    });

    it('request telemetry api and receiving equipments', (done) => {
      const equipmentOne = generateFacadeEquipment('a-equipment-id-1');
      let equipmentTwo = generateFacadeEquipment('a-equipment-id-2');
      equipmentTwo.attributes.trackingPoint = {
        "location": {
          "coordinates": [
            0.9392138888888889,
            52.6362222,
            116
          ],
          "type": "Point"
        },
        "status": "STOPPEDIDLE"
      };

      respondWithSuccess(
        canVariablesFetcher.fetchByEquipmentId(['a-equipment-id-1', 'a-equipment-id-2'], authenticationHeader),
        {
          'a-equipment-id-1': { trackingData: equipmentOne.attributes.trackingData, trackingPoint: equipmentOne.attributes.trackingPoint },
          'a-equipment-id-2': { trackingData: equipmentTwo.attributes.trackingData, trackingPoint: equipmentTwo.attributes.trackingPoint }
        }
      );

      telemetryRequest = {
        method: 'GET',
        json: true,
        url: `${FUSE_TELEMETRY_API_URL}/equipment?offset=0&limit=100`,
        headers: {
          Authorization: authenticationHeader
        }
      };

      respondWithSuccess(httpClient(telemetryRequest), {
        equipment: [
          generateTelemetryEquipment('a-equipment-id-1'),
          generateTelemetryEquipment('a-equipment-id-2'),
        ],
        links: {}
      });

      const expectedResponse = {
        data: [
          equipmentOne,
          equipmentTwo
        ]
      };

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
        url: `/equipments/${equipmentId}`,
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

      let telemetryResponse = readFixture('telemetrySearch');
      telemetryResponse.meta.aggregations.equip_agg[0].key = '1-2-3-a';
      delete telemetryResponse.meta.aggregations.equip_agg[1];

      let expectedResponse = {
        '1-2-3-a': {
          'ENGINE_HOURS': '17059320',
          'ENGINE_SPEED': '1659.875'
        }
      };

      let mockedSearchUri = generateSearchUrl(['1-2-3-a']);

      respondWithSuccess(httpClient({
        method: 'GET',
        json: true,
        uri: mockedSearchUri,
        headers: {
          'Authorization': authenticationHeader
        }
      }), telemetryResponse);
    });

    it('get request equipment by id with successful authorization header', (done) => {
      const expectedResponse = {
        data: generateFacadeEquipment(equipmentId)
      };

      respondWithSuccess(httpClient(telemetryRequest), {
        equipment: [generateTelemetryEquipment(equipmentId)],
        links: {}
      });

      let telemetryReponse = {
        "meta": {
          "aggregations": {
            "equip_agg": [
              {
                "key": equipmentId,
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
      };

      let trackingPointResponse = readFixture('trackingPoint');
      trackingPointResponse.linked.trackingPoints[0].links.equipment = equipmentId;
      trackingPointResponse.meta.aggregations.equip_agg[0].key = equipmentId;
      delete trackingPointResponse.meta.aggregations.equip_agg[1];
      let mockedSearchUri = generateSearchUrl([equipmentId]);
      const mockedSearchTrackingPointUri = generateTrackingPointSearchUrl([equipmentId]); 

      respondWithSuccess(httpClient({
        method: 'GET',
        json: true,
        uri: mockedSearchUri,
        headers: {
          'Authorization': authenticationHeader
        }
      }), telemetryReponse);
      
      respondWithSuccess(httpClient({
        method: 'GET',
        json: true,
        uri: mockedSearchTrackingPointUri,
        headers: {
          'Authorization': authenticationHeader
        }
      }), trackingPointResponse);

      server.inject(options, (res) => {
        expect(res.statusCode).to.be.eql(200);
        expect(JSON.parse(res.payload)).to.be.eql(expectedResponse);
        done();
      });
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
