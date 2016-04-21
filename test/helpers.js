import supertest from 'supertest';
import chai from 'chai';
import td from 'testdouble';
import Bluebird from 'bluebird';
import fs from 'fs';

global.FUSE_TELEMETRY_API_URL = 'https://agco-fuse-trackers-sandbox.herokuapp.com';
global.expect = chai.expect;
global.td = td;

global.respondWithSuccess = (requestPromiseMock, result) => {
  td.when(requestPromiseMock).thenDo(() => Bluebird.resolve(result));
};

global.respondWithFailure = (requestPromiseMock, result) => {
  td.when(requestPromiseMock).thenDo(() => Bluebird.reject(result));
};

global.readFixture = (fixtureName, partialObject) => {
  const fixture = JSON.parse(fs.readFileSync(`${__dirname}/fixtures/${fixtureName}Fixture.json`, 'utf8'));
  return Object.assign({}, fixture, partialObject);
};
