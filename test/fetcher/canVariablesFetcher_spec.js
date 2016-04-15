import CanVariablesFetcher from '../../fetcher/canVariablesFetcher.js';

describe('CanVariablesFetcher', () => {
  it('fetches can variables data by equipment id', (done) => {

    let telemetryResponse = readFixture('telemetrySearch', {});
    telemetryResponse.meta.aggregations.equip_agg[0].key = 'equipment-id-1';
    telemetryResponse.meta.aggregations.equip_agg[0].spn_ag[0].spn_latest_ag[0].value = '17059320';
    telemetryResponse.meta.aggregations.equip_agg[0].spn_ag[1].spn_latest_ag[0].value = '1659.875';
    telemetryResponse.meta.aggregations.equip_agg[1].key = 'equipment-id-2';
    telemetryResponse.meta.aggregations.equip_agg[1].spn_ag[0].spn_latest_ag[0].value = '17059320';
    telemetryResponse.meta.aggregations.equip_agg[1].spn_ag[1].spn_latest_ag[0].value = '1659.875';

    let expectedResponse = {
      'equipment-id-1': {
        'ENGINE_HOURS': '17059320',
        'ENGINE_SPEED': '1659.875'
      },
      'equipment-id-2': {
        'ENGINE_HOURS': '17059320',
        'ENGINE_SPEED': '1659.875'
      }
    };

    let mockedSearchUri = 'https://agco-fuse-trackers-sandbox.herokuapp.com/trackingData/search?include=trackingPoint&links.canVariable.name=ENGINE_HOURS,ENGINE_SPEED,DRIVING_DIRECTION&aggregations=equip_agg&equip_agg.property=links.trackingPoint.equipment.id&equip_agg.aggregations=spn_ag%2Ctp_latest_ag&spn_ag.property=links.canVariable.name&spn_ag.aggregations=spn_latest_ag&spn_latest_ag.type=top_hits&spn_latest_ag.sort=-links.trackingPoint.timeOfOccurrence&spn_latest_ag.limit=1&spn_latest_ag.include=canVariable%2CcanVariable.standardUnit&tp_latest_ag.type=top_hits&tp_latest_ag.sort=-links.trackingPoint.timeOfOccurrence&tp_latest_ag.limit=1&tp_latest_ag.fields=links.trackingPoint&tp_latest_ag.include=trackingPoint&links.trackingPoint.equipment.id=equipment-id-1,equipment-id-2';
    let mockedAuthorizationBearer = 'fake-bearer';

    respondWithSuccess(httpClient({
      method: 'GET',
      json: true,
      uri: mockedSearchUri,
      headers: {
        'Authorization': mockedAuthorizationBearer
      }
    }), telemetryResponse);

    let canVariablesFetcher = new CanVariablesFetcher(httpClient);
    canVariablesFetcher.fetchByEquipmentId(['equipment-id-1','equipment-id-2'], mockedAuthorizationBearer)
    .then((response) => {
      expect(response).to.be.eql(expectedResponse);
      done();
    });
  });
});
