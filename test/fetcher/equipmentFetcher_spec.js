import EquipmentFetcher from '../../fetcher/equipmentFetcher.js';

describe('EquipmentFetcher', () => {
  let httpClient, equipmentFetcher;
  const authenticationHeader = 'This is a Bearer token';

  beforeEach(() => {
    httpClient = td.function();
    equipmentFetcher = new EquipmentFetcher(httpClient);
  });

  it('fetches an equipment list', (done) => {
    const equipmentResponse = {
      equipment: [
        generateTelemetryEquipment('a-equipment-id-1'),
        generateTelemetryEquipment('a-equipment-id-2'),
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

    equipmentFetcher.findAll(11, 50, authenticationHeader)
      .then((data) => {
        expect(data).to.be.eql(equipmentResponse);
      })
      .then(done);
  });

  it('fetches an equipment by id', (done) => {
    const equipmentResponse = {
      equipment: [
        generateTelemetryEquipment('a-equipment-id-1'),
      ],
      links: {}
    };

    const equipmentRequest = {
      method: 'GET',
      json: true,
      url: `${FUSE_TELEMETRY_API_URL}/equipment/a-equipment-id-1`,
      headers: {
        Authorization: authenticationHeader
      }
    };
    respondWithSuccess(httpClient(equipmentRequest), equipmentResponse);

    equipmentFetcher.findById('a-equipment-id-1', authenticationHeader)
      .then((data) => {
        expect(data).to.be.eql(equipmentResponse);
      })
      .then(done);
  });
});
