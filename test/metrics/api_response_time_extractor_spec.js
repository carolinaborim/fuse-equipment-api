import ApiResponseTimeExtractor from '../../src/metrics/apiResponseTimeExtractor';
import ClientInformationFetcher from '../../src/fetcher/clientInformationFetcher';
import td from 'testdouble';

describe('API response time extractor', () => {
  const authorizationHeader = 'Basic ???';
  const clientID = '12345';
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
  let apiResponseTimeExtractor;

  beforeEach(() => {
    const whoAmI = td.function();
    td.when(whoAmI(authorizationHeader)).thenReturn({
      clientID,
      username
    });

    clientInformationFetcher = td.object(ClientInformationFetcher);
    clientInformationFetcher.whoAmI = whoAmI;

    apiResponseTimeExtractor = new ApiResponseTimeExtractor(clientInformationFetcher);
  });

  it('should extract application name', (done) => {
    const events = apiResponseTimeExtractor.extract(request);
    expect(events.appName).to.be.eql('fuse-equipment-api');
    done();
  });

  it('should extract path', (done) => {
    const events = apiResponseTimeExtractor.extract(request);
    expect(events.path).to.be.eql('/equipment');
    done();
  });

  it('should extract HTTP method', (done) => {
    const events = apiResponseTimeExtractor.extract(request);
    expect(events.method).to.be.eql('get');
    done();
  });

  it('should extract HTTP status code', (done) => {
    const events = apiResponseTimeExtractor.extract(request);
    expect(events.statusCode).to.be.eql(200);
    done();
  });

  it('should extract cliente ID', (done) => {
    const events = apiResponseTimeExtractor.extract(request);
    expect(events.clientID).to.be.eql(clientID);
    done();
  });

  it('should extract username', (done) => {
    const events = apiResponseTimeExtractor.extract(request);
    expect(events.username).to.be.eql(username);
    done();
  });

  it('should extract response time', (done) => {
    const events = apiResponseTimeExtractor.extract(request);
    expect(events.metric).to.be.eql(27);
    done();
  });

  it('should extract events unit', (done) => {
    const events = apiResponseTimeExtractor.extract(request);
    expect(events.metricUnit).to.be.eql('miliseconds');
    done();
  });

  it('should extract description', (done) => {
    const events = apiResponseTimeExtractor.extract(request);
    expect(events.description).to.be.eql('Response time in miliseconds');
    done();
  });

  it('should extract tags', (done) => {
    const events = apiResponseTimeExtractor.extract(request);
    expect(events.tags).to.be.eql(['response-time', 'equipment-facade']);
    done();
  });
});
