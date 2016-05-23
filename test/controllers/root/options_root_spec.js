import app from '../../../app';
import CanVariablesFetcher from '../../../fetcher/canVariablesFetcher';
import EquipmentFetcher from '../../../fetcher/equipmentFetcher';
import td from 'testdouble';
import TrackingPointFetcher from '../../../fetcher/trackingPointFetcher';

describe('RootController', () => {
  let server;

  beforeEach(() => {
    const canVariablesFetcher = td.object(CanVariablesFetcher);
    const equipmentFetcher = td.object(EquipmentFetcher);
    const trackingPointFetcher = td.object(TrackingPointFetcher);

    server = app(equipmentFetcher, canVariablesFetcher, trackingPointFetcher);
  });

  describe('Route: /', () => {
    it('should return the list of allowed HTTP methods', (done) => {
      const options = {
        url: '/',
        method: 'OPTIONS'
      };

      const expectedResponse = '';

      server.inject(options, (res) => {
        expect(res.statusCode).to.be.eql(200);
        expect(res.headers.allow).to.be.eql('GET');
        expect(res.payload).to.be.eql(expectedResponse);
        done();
      });
    });

    it('should return the list of available resources', (done) => {
      const options = {
        url: '/',
        method: 'GET'
      };

      const expectedResponse = {
        meta: {
          description: 'The Equipment API is a façade whose goal is to provide an ' +
            'easier way of retrieving equipment related structured information. ' +
            'The equipment information are retrieved from the Telemetry API and ' +
            'contains the same values, with the structure modeled after the ' +
            'equipment concept.'
        },
        links: {
          self: {
            href: '/',
            type: 'root'
          },
          equipment: {
            href: '/equipment',
            type: 'equipment'
          },
          docs: {
            href: '/docs',
            type: 'documentation'
          }
        }
      };

      server.inject(options, (res) => {
        expect(res.statusCode).to.be.eql(200);
        expect(JSON.parse(res.payload)).to.be.eql(expectedResponse);
        done();
      });
    });
  });
});
