import ResponseTimeExtractor from '../../src/metrics/responseTimeExtractor';
import ResponseTimeTransformer from '../../src/metrics/transformers/responseTimeTransformer';
import UserInfoFetcher from '../../src/fetcher/userInfoFetcher';
import UserInfoTransformer from '../../src/metrics/transformers/userInfoTransformer';
import td from 'testdouble';

describe('Response time extractor', () => {
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

  let userInfoFetcher;
  let userInfoTransformer;
  let responseTimeTransformer;
  let responseTimeExtractor;

  beforeEach(() => {
    const whoAmI = td.function();
    const whoAmIResult = '{ \
    "serviceUsers": [{ \
      "id": "fake-id", \
      "emailAddress": "user@example.com", \
      "status": "active", \
      "links": { \
        "roles": ["fake-role"] \
      } \
    }] \
    }';
    const whoAmIPromise = new Promise((resolve) => {
      resolve(whoAmIResult);
    });
    td.when(whoAmI(authorizationHeader)).thenReturn(whoAmIPromise);

    userInfoFetcher = td.object(UserInfoFetcher);
    userInfoFetcher.whoAmI = whoAmI;

    userInfoTransformer = new UserInfoTransformer();
    responseTimeTransformer = new ResponseTimeTransformer();

    responseTimeExtractor = new ResponseTimeExtractor(userInfoFetcher,
                                                      userInfoTransformer,
                                                      responseTimeTransformer);
  });


  it('should extract path', (done) => {
    responseTimeExtractor.extract(request)
    .then((events) => {
      expect(events.path).to.be.eql('/equipment');
    })
    .then(done);
  });

  it('should extract HTTP method', (done) => {
    responseTimeExtractor.extract(request)
    .then((events) => {
      expect(events.method).to.be.eql('get');
    })
    .then(done);
  });

  it('should extract HTTP status code', (done) => {
    responseTimeExtractor.extract(request)
    .then((events) => {
      expect(events.statusCode).to.be.eql(200);
    })
    .then(done);
  });

  it('should extract cliente ID', (done) => {
    responseTimeExtractor.extract(request)
    .then((events) => {
      expect(events.clientID).to.be.eql(clientID);
    })
    .then(done);
  });

  it('should extract username', (done) => {
    responseTimeExtractor.extract(request)
    .then((events) => {
      expect(events.username).to.be.eql(username);
    })
    .then(done);
  });

  it('should extract response time', (done) => {
    responseTimeExtractor.extract(request)
    .then((events) => {
      expect(events.metric).to.be.eql(27);
    })
    .then(done);
  });

  it('should extract events unit', (done) => {
    responseTimeExtractor.extract(request)
    .then((events) => {
      expect(events.metricUnit).to.be.eql('miliseconds');
    })
    .then(done);
  });

  it('should extract description', (done) => {
    responseTimeExtractor.extract(request)
    .then((events) => {
      expect(events.description).to.be.eql('Response time in miliseconds');
    })
    .then(done);
  });

  it('should extract type', (done) => {
    responseTimeExtractor.extract(request)
    .then((events) => {
      expect(events.type).to.be.eql('metrics');
    })
    .then(done);
  });

  it('should extract tags', (done) => {
    responseTimeExtractor.extract(request)
    .then((events) => {
      expect(events.tags).to.be.eql(['response-time', 'equipment-facade']);
    })
    .then(done);
  });
});
