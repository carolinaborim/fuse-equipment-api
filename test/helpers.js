import supertest from 'supertest';
import chai from 'chai';
import app from '../app';
import td from 'testdouble';
import Bluebird from 'bluebird';

global.FUSE_TELEMETRY_API_URL = 'http://localhost:9000';
global.expect = chai.expect;
global.td = td;

global.respondWithSuccess = (requestPromiseMock, result) => {
  td.when(requestPromiseMock).thenDo(() => Bluebird.resolve(result));
};

global.respondWithFailure = (requestPromiseMock, result) => {
  td.when(requestPromiseMock).thenDo(() => Bluebird.reject(result));
};

beforeEach(() => {
  global.httpClient = td.function();
  global.server = app(httpClient, FUSE_TELEMETRY_API_URL);
});
