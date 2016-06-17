import ApiResponseTimeExtractor from '../../src/metrics/apiResponseTimeExtractor';
import ClientInformationFetcher from '../../src/fetcher/clientInformationFetcher';
import ClientInformationTransformer from '../../src/metrics/transformers/clientInformationTransformer';
import td from 'testdouble';

describe('API response time extractor', () => {
  const authorizationHeader = 'Basic ???';
  const clientID = 'fake-id';
  const username = 'user@example.com';
  const request = {
    path: '/equipment',
    headers: {
      authorization: authorizationHeader
    },
    method: 'get',
    response: {
      statusCode: 200
    },
    info: {
      received: 1466114946526,
      responded: 1466114946553
    }
  };

  let clientInformationFetcher;
  let clientInformationTransformer;
  let apiResponseTimeExtractor;

  beforeEach(() => {
    const whoAmI = td.function();
    const whoAmIResult = {
      serviceUsers: [{
        id: 'fake-id',
        emailAddress: 'user@example.com',
        status: 'active',
        links: {
          roles: ['fake-role']
        }
      }]
    };
    const whoAmIPromise = new Promise((resolve) => {
      resolve(whoAmIResult);
    });
    td.when(whoAmI(authorizationHeader)).thenReturn(whoAmIPromise);

    clientInformationFetcher = td.object(ClientInformationFetcher);
    clientInformationFetcher.whoAmI = whoAmI;

    const transform = td.function();
    const transformPromise = new Promise((resolve) => {
      const result = {
        clientID,
        username
      };
      resolve(result);
    });
    td.when(transform(whoAmIResult)).thenReturn(transformPromise);
    clientInformationTransformer = td.object(ClientInformationTransformer);
    clientInformationTransformer.transform = transform;

    apiResponseTimeExtractor = new ApiResponseTimeExtractor(clientInformationFetcher, clientInformationTransformer);
  });

  it('should extract application name', (done) => {
    apiResponseTimeExtractor.extract(request)
    .then((events) => {
      expect(events.appName).to.be.eql('fuse-equipment-api');
    })
    .then(done);
  });

  it('should extract path', (done) => {
    apiResponseTimeExtractor.extract(request)
    .then((events) => {
      expect(events.path).to.be.eql('/equipment');
    })
    .then(done);
  });

  it('should extract HTTP method', (done) => {
    apiResponseTimeExtractor.extract(request)
    .then((events) => {
      expect(events.method).to.be.eql('get');
    })
    .then(done);
  });

  it('should extract HTTP status code', (done) => {
    apiResponseTimeExtractor.extract(request)
    .then((events) => {
      expect(events.statusCode).to.be.eql(200);
    })
    .then(done);
  });

  it('should extract cliente ID', (done) => {
    apiResponseTimeExtractor.extract(request)
    .then((events) => {
      expect(events.clientID).to.be.eql(clientID);
    })
    .then(done);
  });

  it('should extract username', (done) => {
    apiResponseTimeExtractor.extract(request)
    .then((events) => {
      expect(events.username).to.be.eql(username);
    })
    .then(done);
  });

  it('should extract response time', (done) => {
    apiResponseTimeExtractor.extract(request)
    .then((events) => {
      expect(events.metric).to.be.eql(27);
    })
    .then(done);
  });

  it('should extract events unit', (done) => {
    apiResponseTimeExtractor.extract(request)
    .then((events) => {
      expect(events.metricUnit).to.be.eql('miliseconds');
    })
    .then(done);
  });

  it('should extract description', (done) => {
    apiResponseTimeExtractor.extract(request)
    .then((events) => {
      expect(events.description).to.be.eql('Response time in miliseconds');
    })
    .then(done);
  });

  it('should extract tags', (done) => {
    apiResponseTimeExtractor.extract(request)
    .then((events) => {
      expect(events.tags).to.be.eql(['response-time', 'equipment-facade']);
    })
    .then(done);
  });
});
