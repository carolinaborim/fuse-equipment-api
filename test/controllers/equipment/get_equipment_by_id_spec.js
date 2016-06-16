import app from '../../../src/app';
import CanVariablesFetcher from '../../../src/fetcher/canVariablesFetcher';
import EquipmentFetcher from '../../../src/fetcher/equipmentFetcher';
import helpers from '../../helpers';
import td from 'testdouble';
import TrackingPointFetcher from '../../../src/fetcher/trackingPointFetcher';

describe('Listing a specific equipment (/equipment/{id})', () => {
  let canVariablesFetcher;
  let equipmentFetcher;
  let trackingPointFetcher;
  let server;
  let options = {};

  const authenticationHeader = 'Bearer VALID_TOKEN';

  beforeEach(() => {
    canVariablesFetcher = td.object(CanVariablesFetcher);
    equipmentFetcher = td.object(EquipmentFetcher);
    trackingPointFetcher = td.object(TrackingPointFetcher);

    server = app(equipmentFetcher, canVariablesFetcher, trackingPointFetcher);
  });

  const generateFacadeEquipment = (equipmentId) => {
    return helpers.readFixture('facadeEquipment', { id: equipmentId });
  };

  const equipmentId = '1-2-3-a';

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
    const expectedEquipment = generateFacadeEquipment(equipmentId);

    helpers.respondWithSuccess(
      canVariablesFetcher.fetchByEquipmentId(['1-2-3-a'], authenticationHeader),
      { '1-2-3-a': expectedEquipment.attributes.trackingData });

    helpers.respondWithSuccess(
      trackingPointFetcher.fetchByEquipmentId(['1-2-3-a'], authenticationHeader),
      { '1-2-3-a': expectedEquipment.attributes.trackingPoint });

    helpers.respondWithSuccess(
      equipmentFetcher.findById(equipmentId, authenticationHeader),
      {
        equipment: [helpers.generateTelemetryEquipment(equipmentId)],
        links: {}
      });

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

    helpers.respondWithFailure(
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

    helpers.respondWithFailure(
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

    helpers.respondWithFailure(
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
      });

    server.inject(options, (res) => {
      expect(res.statusCode).to.be.eql(404);
      expect(JSON.parse(res.payload)).to.be.eql(expectedResponse);
      done();
    });
  });

  it('get request status code diferent from any mapped error', (done) => {
    const expectedResponse = {
      errors: [{
        status: 500,
        title: 'An unhandled error occurred'
      }]
    };

    helpers.respondWithFailure(
      equipmentFetcher.findById(equipmentId, authenticationHeader),
      {
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
