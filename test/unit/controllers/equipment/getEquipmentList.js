import app from '../../../../src/app';
import CanVariablesFetcher from '../../../../src/fetchers/canVariables';
import EquipmentFetcher from '../../../../src/fetchers/equipment';
import helpers from '../../helpers';
import td from 'testdouble';
import TrackingPointFetcher from '../../../../src/fetchers/trackingPoints';

describe('Listing equipment (/equipment)', () => {
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

  before(() => {
    options = {
      url: '/equipment',
      method: 'GET',
      headers: {
        Authorization: authenticationHeader
      }
    };
  });

  it('should allow offset and limit pagination parameters', (done) => {
    helpers.respondWithSuccess(
      equipmentFetcher.findAll(11, 50, authenticationHeader),
      {
        equipment: [
          helpers.generateTelemetryEquipment('a-equipment-id-1'),
          helpers.generateTelemetryEquipment('a-equipment-id-2')
        ],
        links: {}
      }
    );

    const equipmentOne = generateFacadeEquipment('a-equipment-id-1');
    const equipmentTwo = generateFacadeEquipment('a-equipment-id-2');
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

    helpers.respondWithSuccess(
      canVariablesFetcher.fetchByEquipmentId(['a-equipment-id-1', 'a-equipment-id-2'], authenticationHeader),
      {
        'a-equipment-id-1': equipmentOne.attributes.trackingData,
        'a-equipment-id-2': equipmentTwo.attributes.trackingData
      });

    helpers.respondWithSuccess(
      trackingPointFetcher.fetchByEquipmentId(['a-equipment-id-1', 'a-equipment-id-2'], authenticationHeader),
      {
        'a-equipment-id-1': equipmentOne.attributes.trackingPoint,
        'a-equipment-id-2': equipmentTwo.attributes.trackingPoint
      });

    const expectedResponse = {
      data: [
        equipmentOne,
        equipmentTwo
      ]
    };

    const equipmentOffsetRequest = {
      url: '/equipment?offset=11&limit=50',
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

  it('request telemetry api and receiving equipment', (done) => {
    const equipmentOne = generateFacadeEquipment('a-equipment-id-1');
    const equipmentTwo = generateFacadeEquipment('a-equipment-id-2');
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

    helpers.respondWithSuccess(
      canVariablesFetcher.fetchByEquipmentId(['a-equipment-id-1', 'a-equipment-id-2'], authenticationHeader),
      {
        'a-equipment-id-1': equipmentOne.attributes.trackingData,
        'a-equipment-id-2': equipmentTwo.attributes.trackingData
      });

    helpers.respondWithSuccess(
      trackingPointFetcher.fetchByEquipmentId(['a-equipment-id-1', 'a-equipment-id-2'], authenticationHeader),
      {
        'a-equipment-id-1': equipmentOne.attributes.trackingPoint,
        'a-equipment-id-2': equipmentTwo.attributes.trackingPoint
      });

    helpers.respondWithSuccess(
      equipmentFetcher.findAll(0, 100, authenticationHeader),
      {
        equipment: [
          helpers.generateTelemetryEquipment('a-equipment-id-1'),
          helpers.generateTelemetryEquipment('a-equipment-id-2')
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
    helpers.respondWithFailure(
      equipmentFetcher.findAll(0, 100, authenticationHeader),
      {
        response: {
          statusCode: 401,
          body: 'Unauthorized'
        }
      });

    server.inject(options, (res) => {
      expect(res.statusCode).to.be.eql(401);
      expect(JSON.parse(res.payload)).to.be.eql({
        errors: [{
          status: 401,
          title: 'Unauthorized'
        }]
      });
      done();
    });
  });
});
