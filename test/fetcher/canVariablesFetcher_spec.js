import CanVariablesFetcher from '../../fetcher/canVariablesFetcher.js';

describe('CanVariablesFetcher', () => {
  it('fetches can variables data by equipment id', (done) => {

    let telemetryResponse = readFixture('telemetrySearch');
    telemetryResponse.meta.aggregations.equip_agg[0].key = 'equipment-id-1';
    telemetryResponse.meta.aggregations.equip_agg[0].spn_ag[0].spn_latest_ag[0].value = '17059320';
    telemetryResponse.meta.aggregations.equip_agg[0].spn_ag[1].spn_latest_ag[0].value = '1659.875';
    telemetryResponse.meta.aggregations.equip_agg[1].key = 'equipment-id-2';
    telemetryResponse.meta.aggregations.equip_agg[1].spn_ag[0].spn_latest_ag[0].value = '17059320';
    telemetryResponse.meta.aggregations.equip_agg[1].spn_ag[1].spn_latest_ag[0].value = '1659.875';

    let trackingPointResponse = readFixture('trackingPoint');
    trackingPointResponse.linked.trackingPoints[0].links.equipment = 'equipment-id-1';
    trackingPointResponse.meta.aggregations.equip_agg[0].key = 'equipment-id-1';
    trackingPointResponse.linked.trackingPoints[1].links.equipment = 'equipment-id-2';
    trackingPointResponse.meta.aggregations.equip_agg[1].key = 'equipment-id-2';    

    let expectedResponse = {
      'equipment-id-1': {
        'trackingPoint': {
        'timeOfOccurrence': '2015-11-08T02:27:45.000Z',
        'timeOfReception': '2015-11-17T23:05:04.000Z',
        'heading': 102,
        'externalId': '50ac7e8e8e118d15c19cdbbd9d976eed_8',
        'location': {
          'coordinates': [
            8.173922222222222,
            51.7213528,
            116
          ],
          'type': 'Point'
        },
        'status': 'WORKING',
        'id': '97c21b73-22ff-4e5e-aa6d-46178c8e7460',
        'links': {
          'equipment': 'equipment-id-1',
          'duty': '20de95dc-0b28-4f89-812d-e7ffb4581e74'
        }
      },
        'trackingData': {
          'ENGINE_HOURS': '17059320',
          'ENGINE_SPEED': '1659.875'
        }
      },
      'equipment-id-2': {
        'trackingPoint': {
        'timeOfOccurrence': '2015-11-08T02:27:45.000Z',
        'timeOfReception': '2015-11-17T22:54:10.000Z',
        'heading': 102,
        'externalId': '14c746f8acf0d2f5e76c3cb913751074_8',
        'location': {
          'coordinates': [
            0.9392138888888889,
            52.6362222,
            116
          ],
          'type': 'Point'
        },
        'status': 'STOPPEDIDLE',
        'id': '0c760770-13c2-4bb4-b161-9e9845df1eeb',
        'links': {
          'equipment': 'equipment-id-2',
          'duty': '17d87b74-831a-4f27-acc1-0a965bc8578a'
        }
      },
        'trackingData': {
          'ENGINE_HOURS': '17059320',
          'ENGINE_SPEED': '1659.875'
        }
      }
    };

    let mockedSearchUri = 'https://agco-fuse-trackers-sandbox.herokuapp.com/trackingData/search?include=trackingPoint&links.canVariable.name=ENGINE_HOURS,ENGINE_SPEED,DRIVING_DIRECTION&aggregations=equip_agg&equip_agg.property=links.trackingPoint.equipment.id&equip_agg.aggregations=spn_ag%2Ctp_latest_ag&spn_ag.property=links.canVariable.name&spn_ag.aggregations=spn_latest_ag&spn_latest_ag.type=top_hits&spn_latest_ag.sort=-links.trackingPoint.timeOfOccurrence&spn_latest_ag.limit=1&spn_latest_ag.include=canVariable%2CcanVariable.standardUnit&tp_latest_ag.type=top_hits&tp_latest_ag.sort=-links.trackingPoint.timeOfOccurrence&tp_latest_ag.limit=1&tp_latest_ag.fields=links.trackingPoint&tp_latest_ag.include=trackingPoint&links.trackingPoint.equipment.id=equipment-id-1,equipment-id-2';

    let mockedSerchTrackingPointUri = 'https://agco-fuse-trackers-sandbox.herokuapp.com/trackingData/search?include=trackingPoint,trackingPoint.duty&aggregations=equip_agg&equip_agg.property=links.trackingPoint.equipment.id&equip_agg.aggregations=tp_latest_ag&tp_latest_ag.type=top_hits&tp_latest_ag.sort=-links.trackingPoint.timeOfOccurrence&tp_latest_ag.limit=1&tp_latest_ag.fields=links.trackingPoint&tp_latest_ag.include=trackingPoint&links.trackingPoint.equipment.id=equipment-id-1,equipment-id-2';
    let mockedAuthorizationBearer = 'fake-bearer';

    respondWithSuccess(httpClient({
      method: 'GET',
      json: true,
      uri: mockedSearchUri,
      headers: {
        'Authorization': mockedAuthorizationBearer
      }
    }), telemetryResponse);

    respondWithSuccess(httpClient({
      method: 'GET',
      json: true,
      uri: mockedSerchTrackingPointUri,
      headers: {
        'Authorization': mockedAuthorizationBearer
      }
    }), trackingPointResponse);


    let canVariablesFetcher = new CanVariablesFetcher(httpClient);
    canVariablesFetcher.fetchByEquipmentId(['equipment-id-1', 'equipment-id-2'], mockedAuthorizationBearer)
      .then((response) => {
        expect(response).to.be.eql(expectedResponse);
        done();
      });
  });
});
