import config from '../../config';
import TrackingPointFetcher from '../../fetcher/trackingPointFetcher';

describe('TrackingPointFetcher', () => {
  let httpClient, trackingPointFetcher;

  beforeEach(() => {
    httpClient = td.function();
    trackingPointFetcher = new TrackingPointFetcher(httpClient);
  });

  it('fetches tracking point variables data by equipment id', (done) => {
    let trackingPointResponse = readFixture('trackingPoint');
    trackingPointResponse.linked.trackingPoints[0].links.equipment = 'equipment-id-1';
    trackingPointResponse.meta.aggregations.equip_agg[0].key = 'equipment-id-1';
    trackingPointResponse.linked.trackingPoints[1].links.equipment = 'equipment-id-2';
    trackingPointResponse.meta.aggregations.equip_agg[1].key = 'equipment-id-2';

    let expectedResponse = {
      'equipment-id-1': {
        timeOfOccurrence: '2015-11-08T02:27:45.000Z',
        timeOfReception: '2015-11-17T23:05:04.000Z',
        heading: 102,
        externalId: '50ac7e8e8e118d15c19cdbbd9d976eed_8',
        location: {
          coordinates: [
            8.173922222222222,
            51.7213528,
            116
          ],
          type: 'Point'
        },
        status: 'WORKING',
        id: '97c21b73-22ff-4e5e-aa6d-46178c8e7460',
        links: {
          equipment: 'equipment-id-1',
          duty: '20de95dc-0b28-4f89-812d-e7ffb4581e74'
        }
      },
      'equipment-id-2': {
        timeOfOccurrence: '2015-11-08T02:27:45.000Z',
        timeOfReception: '2015-11-17T22:54:10.000Z',
        heading: 102,
        externalId: '14c746f8acf0d2f5e76c3cb913751074_8',
        location: {
          coordinates: [
            0.9392138888888889,
            52.6362222,
            116
          ],
          type: 'Point'
        },
        status: 'STOPPEDIDLE',
        id: '0c760770-13c2-4bb4-b161-9e9845df1eeb',
        links: {
          equipment: 'equipment-id-2',
          duty: '17d87b74-831a-4f27-acc1-0a965bc8578a'
        }
      },
    };

    let mockedSerchTrackingPointUri = 'https://agco-fuse-trackers-sandbox.herokuapp.com/trackingData/search?include=trackingPoint,trackingPoint.duty&aggregations=equip_agg&equip_agg.property=links.trackingPoint.equipment.id&equip_agg.aggregations=tp_latest_ag&tp_latest_ag.type=top_hits&tp_latest_ag.sort=-links.trackingPoint.timeOfOccurrence&tp_latest_ag.limit=1&tp_latest_ag.fields=links.trackingPoint&tp_latest_ag.include=trackingPoint&links.trackingPoint.equipment.id=equipment-id-1,equipment-id-2';
    let mockedAuthorizationBearer = 'fake-bearer';

    const trackingPointRequest = {
      url: mockedSerchTrackingPointUri,
      method: 'GET',
      json: true,
      headers: {
        Authorization: mockedAuthorizationBearer
      },
      timeout: config.TIMEOUT
    };
    respondWithSuccess(httpClient(trackingPointRequest), trackingPointResponse);

    trackingPointFetcher.fetchByEquipmentId(
      ['equipment-id-1', 'equipment-id-2'],
      mockedAuthorizationBearer
    ).then((response) => {
      expect(response).to.be.eql(expectedResponse);
      done();
    });
  });

  it('should handle when api returns no tracking point value', (done) => {
    let trackingPointResponse = readFixture('trackingPoint');
    delete trackingPointResponse.linked;

    let expectedResponse = {};

    let mockedSerchTrackingPointUri = 'https://agco-fuse-trackers-sandbox.herokuapp.com/trackingData/search?include=trackingPoint,trackingPoint.duty&aggregations=equip_agg&equip_agg.property=links.trackingPoint.equipment.id&equip_agg.aggregations=tp_latest_ag&tp_latest_ag.type=top_hits&tp_latest_ag.sort=-links.trackingPoint.timeOfOccurrence&tp_latest_ag.limit=1&tp_latest_ag.fields=links.trackingPoint&tp_latest_ag.include=trackingPoint&links.trackingPoint.equipment.id=equipment-id-1,equipment-id-2';
    let mockedAuthorizationBearer = 'fake-bearer';

    const trackingPointRequest = {
      url: mockedSerchTrackingPointUri,
      method: 'GET',
      json: true,
      headers: {
        Authorization: mockedAuthorizationBearer
      },
      timeout: config.TIMEOUT
    };
    respondWithSuccess(httpClient(trackingPointRequest), trackingPointResponse);

    trackingPointFetcher.fetchByEquipmentId(
      ['equipment-id-1', 'equipment-id-2'],
      mockedAuthorizationBearer
    ).then((response) => {
      expect(response).to.be.eql(expectedResponse);
      done();
    });
  });
});
