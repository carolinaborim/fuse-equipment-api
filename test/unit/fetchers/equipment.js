import config from '../../../src/config';
import EquipmentFetcher from '../../../src/fetchers/equipment';
import helpers from '../helpers';
import td from 'testdouble';

describe('EquipmentFetcher', () => {
  let httpClient;
  let equipmentFetcher;

  const authenticationHeader = 'This is a Bearer token';

  beforeEach(() => {
    httpClient = td.function();
    equipmentFetcher = new EquipmentFetcher(httpClient);
  });

  it('fetches an equipment list', (done) => {
    const equipmentResponse = {
      equipment: [
        helpers.generateTelemetryEquipment('a-equipment-id-1'),
        helpers.generateTelemetryEquipment('a-equipment-id-2')
      ],
      links: {}
    };

    const equipmentRequest = {
      method: 'GET',
      json: true,
      url: `${helpers.FUSE_TELEMETRY_API_URL}/equipment`,
      qs: {
        offset: 11,
        limit: 50
      },
      headers: {
        Authorization: authenticationHeader
      },
      timeout: config.TIMEOUT
    };
    helpers.respondWithSuccess(httpClient(equipmentRequest), equipmentResponse);

    equipmentFetcher.findAll(11, 50, authenticationHeader)
      .then((data) => {
        expect(data).to.be.eql(equipmentResponse);
      })
      .then(done);
  });

  it('fetches an equipment by id', (done) => {
    const equipmentResponse = {
      equipment: [
        helpers.generateTelemetryEquipment('a-equipment-id-1')
      ],
      links: {}
    };

    const equipmentRequest = {
      url: `${helpers.FUSE_TELEMETRY_API_URL}/equipment/a-equipment-id-1`,
      method: 'GET',
      json: true,
      headers: {
        Authorization: authenticationHeader
      },
      timeout: config.TIMEOUT
    };
    helpers.respondWithSuccess(httpClient(equipmentRequest), equipmentResponse);

    equipmentFetcher.findById('a-equipment-id-1', authenticationHeader)
      .then((data) => {
        expect(data).to.be.eql(equipmentResponse);
      })
      .then(done);
  });
});
