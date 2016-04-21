import './helpers.js';
import app from '../app';
import CanVariablesFetcher from '../fetcher/canVariablesFetcher';
import EquipmentFetcher from '../fetcher/equipmentFetcher';

describe('EquipmentController', () => {
  let canVariablesFetcher, equipmentFetcher, httpClient, server;
  let options = {};
  let authenticationHeader = 'Bearer VALID_TOKEN';

  beforeEach(() => {
    httpClient = td.function();

    canVariablesFetcher = td.object(CanVariablesFetcher);
    equipmentFetcher = td.object(EquipmentFetcher);

    server = app(equipmentFetcher, canVariablesFetcher);
  });

  const generateFacadeEquipment = (equipmentId) => {
    return readFixture('facadeEquipment', { id: equipmentId});
  };

  describe('Route: equipment', () => {
    before(() => {
      options = {
        url: '/equipments',
        method: 'GET',
        headers: {
          Authorization: authenticationHeader
        }
      };
    });

    it('should allow offset and limit pagination parameters', (done) => {
      respondWithSuccess(
        equipmentFetcher.findAll(11, 50, authenticationHeader),
        {
          equipment: [
            generateTelemetryEquipment('a-equipment-id-1'),
            generateTelemetryEquipment('a-equipment-id-2'),
          ],
          links: {}
        }
      );

      const equipmentOne = generateFacadeEquipment('a-equipment-id-1');
      let equipmentTwo = generateFacadeEquipment('a-equipment-id-2');
      equipmentTwo.attributes.trackingPoint = {
        location: {
          coordinates: [
            0.9392138888888889,
            52.6362222,
            116
          ],
          type: 'Point'
        },
        status: 'STOPPEDIDLE'
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
        location: {
          coordinates: [
            0.9392138888888889,
            52.6362222,
            116
          ],
          type: 'Point'
        },
        status: 'STOPPEDIDLE'
      };

      respondWithSuccess(
        canVariablesFetcher.fetchByEquipmentId(['a-equipment-id-1', 'a-equipment-id-2'], authenticationHeader),
        {
          'a-equipment-id-1': { trackingData: equipmentOne.attributes.trackingData, trackingPoint: equipmentOne.attributes.trackingPoint },
          'a-equipment-id-2': { trackingData: equipmentTwo.attributes.trackingData, trackingPoint: equipmentTwo.attributes.trackingPoint }
        }
      );

      respondWithSuccess(
        equipmentFetcher.findAll(0, 100, authenticationHeader),
        {
          equipment: [
            generateTelemetryEquipment('a-equipment-id-1'),
            generateTelemetryEquipment('a-equipment-id-2'),
          ],
          links: {}
        }
      );

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
      respondWithFailure(
        equipmentFetcher.findAll(0, 100, authenticationHeader),
        {
          response: {
            statusCode: 401,
            body: 'Unauthorized'
          }
        }
      );

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
    });

    it('get request equipment by id with successful authorization header', (done) => {
      const expectedEquipment = generateFacadeEquipment(equipmentId);

      respondWithSuccess(
        canVariablesFetcher.fetchByEquipmentId(['1-2-3-a'], authenticationHeader),
        {
          '1-2-3-a': { trackingData: expectedEquipment.attributes.trackingData, trackingPoint: expectedEquipment.attributes.trackingPoint },
        }
      );

      respondWithSuccess(
        equipmentFetcher.findById(equipmentId, authenticationHeader),
        {
          equipment: [generateTelemetryEquipment(equipmentId)],
          links: {}
        }
      );

      const expectedResponse = {
        data: expectedEquipment
      };

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

      respondWithFailure(
        equipmentFetcher.findById(equipmentId, authenticationHeader),
        {
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
        }
      );

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

      respondWithFailure(
        equipmentFetcher.findById(equipmentId, authenticationHeader),
        {
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
        }
      );

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

      respondWithFailure(
        equipmentFetcher.findById(equipmentId, authenticationHeader),
        {
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
        }
      );

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

      respondWithFailure(
        equipmentFetcher.findById(equipmentId, authenticationHeader),
        {
          response: {
            statusCode: 123,
            body: 'Error'
          }
        }
      );

      server.inject(options, (res) => {
        expect(res.statusCode).to.be.eql(500);
        expect(JSON.parse(res.payload)).to.be.eql(expectedResponse);
        done();
      });
    });
  });
});
