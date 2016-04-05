'use strict';

describe('Route: equipment', () => {
  it('responds with a Hello world', (done) => {
    const expectedResponse = 'hello world';
    const options = {
        url: '/equipment',
        method: 'GET'
    };

    server.inject(options, function (res) {
        expect(res.payload).to.be.eql(expectedResponse);
        done();
    });

  });

  it('responds with a success http status code', (done) => {
    const expectedResponse = 'hello world';
    const options = {
        url: '/equipment',
        method: 'GET'
    };

    server.inject(options, function (res) {
        expect(res.statusCode).to.be.eql(200);
        done();
    });

  });
});