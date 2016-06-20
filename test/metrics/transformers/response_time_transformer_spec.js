import ResponseTimeTransformer from '../../../src/metrics/transformers/responseTimeTransformer';

describe('Response time transformer', () => {
  it('should transform received and responded timestamps into elapsed miliseconds', (done) => {
    const requestInfo = {
      received: 1466114946526,
      responded: 1466114946553
    };

    const responseTimeTransformer = new ResponseTimeTransformer();
    const data = responseTimeTransformer.transform(requestInfo);
    expect(data).to.be.eql(27);
    done();
  });
});
