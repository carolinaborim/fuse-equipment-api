import supertest from 'supertest';
import chai from 'chai';
import app from '../app';
import td from 'testdouble';
import Bluebird from 'bluebird';

global.expect = chai.expect;
global.FUSE_TELEMETRY_API_URL = 'http://localhost:9000';
global.httpClient = td.function();
global.server = app(httpClient, FUSE_TELEMETRY_API_URL);
global.request = supertest(server);
global.td = td;

global.respondWithSuccess = function respondWithSuccess(requestPromiseMock, result) {
  td.when(requestPromiseMock).thenDo(() => Bluebird.resolve(result));
};

global.respondWithFailure = function respondWithSuccess(requestPromiseMock, result) {
  td.when(requestPromiseMock).thenDo(() => Bluebird.reject(result));
};
