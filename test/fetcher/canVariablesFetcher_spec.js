import config from '../../config';
import CanVariablesFetcher from '../../fetcher/canVariablesFetcher';
import helpers from '../helpers';
import td from 'testdouble';

describe('CanVariablesFetcher', () => {
  let httpClient;
  let canVariablesFetcher;

  beforeEach(() => {
    httpClient = td.function();
    canVariablesFetcher = new CanVariablesFetcher(httpClient);
  });

  const generateSearchUri = (equipmentIds, canVariableNames = config.DEFAULT_CAN_VARIABLES.join(',')) => {
    return 'https://agco-fuse-trackers-sandbox.herokuapp.com/trackingData/search?include=trackingPoint' +
      `&links.canVariable.name=${canVariableNames}` +
      '&aggregations=equip_agg' +
      '&equip_agg.property=links.trackingPoint.equipment.id' +
      '&equip_agg.aggregations=spn_ag%2Ctp_latest_ag' +
      '&spn_ag.property=links.canVariable.name' +
      '&spn_ag.aggregations=spn_latest_ag' +
      '&spn_latest_ag.type=top_hits&spn_latest_ag.sort=-links.trackingPoint.timeOfOccurrence' +
      '&spn_latest_ag.limit=1&spn_latest_ag.include=canVariable%2CcanVariable.standardUnit' +
      '&tp_latest_ag.type=top_hits&tp_latest_ag.sort=-links.trackingPoint.timeOfOccurrence' +
      '&tp_latest_ag.limit=1&tp_latest_ag.fields=links.trackingPoint' +
      '&tp_latest_ag.include=trackingPoint' +
      `&links.trackingPoint.equipment.id=${equipmentIds}`;
  };

  it('fetches can variables data by equipment id', (done) => {
    const telemetryResponse = helpers.readFixture('telemetrySearch');
    telemetryResponse.meta.aggregations.equip_agg[0].key = 'equipment-id-1';
    telemetryResponse.meta.aggregations.equip_agg[0].spn_ag[0].spn_latest_ag[0].value = '17059320';
    telemetryResponse.meta.aggregations.equip_agg[0].spn_ag[1].spn_latest_ag[0].value = '1659.875';
    telemetryResponse.meta.aggregations.equip_agg[1].key = 'equipment-id-2';
    telemetryResponse.meta.aggregations.equip_agg[1].spn_ag[0].spn_latest_ag[0].value = '17059320';
    telemetryResponse.meta.aggregations.equip_agg[1].spn_ag[1].spn_latest_ag[0].value = '1659.875';

    const expectedResponse = {
      'equipment-id-1': {
        ENGINE_HOURS: '17059320',
        ENGINE_SPEED: '1659.875'
      },
      'equipment-id-2': {
        ENGINE_HOURS: '17059320',
        ENGINE_SPEED: '1659.875'
      }
    };

    const mockedSearchUri = generateSearchUri('equipment-id-1,equipment-id-2');
    const mockedAuthorizationBearer = 'fake-bearer';

    const canVariableRequest = {
      url: mockedSearchUri,
      method: 'GET',
      json: true,
      headers: {
        Authorization: mockedAuthorizationBearer
      },
      timeout: config.TIMEOUT
    };
    helpers.respondWithSuccess(httpClient(canVariableRequest), telemetryResponse);

    canVariablesFetcher.fetchByEquipmentId(
      ['equipment-id-1', 'equipment-id-2'],
      mockedAuthorizationBearer
    ).then((response) => {
      expect(response).to.be.eql(expectedResponse);
      done();
    });
  });

  it('should handle when telemetry api returns no tracking data', (done) => {
    const telemetryResponse = helpers.readFixture('telemetrySearch');
    telemetryResponse.meta.aggregations.equip_agg = [];

    const expectedResponse = {};
    const mockedSearchUri = generateSearchUri('equipment-id-1,equipment-id-2');
    const mockedAuthorizationBearer = 'fake-bearer';

    const equipmentRequest = {
      url: mockedSearchUri,
      method: 'GET',
      json: true,
      headers: {
        Authorization: mockedAuthorizationBearer
      },
      timeout: config.TIMEOUT
    };
    helpers.respondWithSuccess(httpClient(equipmentRequest), telemetryResponse);

    canVariablesFetcher.fetchByEquipmentId(
      ['equipment-id-1', 'equipment-id-2'],
      mockedAuthorizationBearer
    ).then((response) => {
      expect(response).to.be.eql(expectedResponse);
      done();
    });
  });
});
