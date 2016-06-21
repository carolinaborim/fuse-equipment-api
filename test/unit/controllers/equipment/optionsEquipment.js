import app from '../../../../src/app';
import CanVariablesFetcher from '../../../../src/fetchers/canVariables';
import EquipmentFetcher from '../../../../src/fetchers/equipment';
import td from 'testdouble';
import TrackingPointFetcher from '../../../../src/fetchers/trackingPoints';

describe('Asking for supported HTTP methods at (/equipment)', () => {
  let canVariablesFetcher;
  let equipmentFetcher;
  let trackingPointFetcher;
  let server;

  beforeEach(() => {
    canVariablesFetcher = td.object(CanVariablesFetcher);
    equipmentFetcher = td.object(EquipmentFetcher);
    trackingPointFetcher = td.object(TrackingPointFetcher);

    server = app(equipmentFetcher, canVariablesFetcher, trackingPointFetcher);
  });

  it('should return the list of allowed HTTP methods', (done) => {
    const optionsRequest = {
      url: '/equipment',
      method: 'OPTIONS'
    };

    const expectedResponse = '';

    server.inject(optionsRequest, (res) => {
      expect(res.statusCode).to.be.eql(200);
      expect(res.headers.allow).to.be.eql('GET');
      expect(res.payload).to.be.eql(expectedResponse);
      done();
    });
  });
});
