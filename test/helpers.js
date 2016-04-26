import supertest from 'supertest';
import chai from 'chai';
import td from 'testdouble';
import Bluebird from 'bluebird';
import fs from 'fs';
import config from '../config';

global.FUSE_TELEMETRY_API_URL = 'https://agco-fuse-trackers-sandbox.herokuapp.com';
global.expect = chai.expect;
global.td = td;
global.DEFAULT_CAN_VARIABLES = config.DEFAULT_CAN_VARIABLES;

global.respondWithSuccess = (requestPromiseMock, result) => {
  td.when(requestPromiseMock).thenDo(() => Bluebird.resolve(result));
};

global.generateTelemetryEquipment = (equipmentId) => {
  return {
    id: equipmentId,
    description: 'Equipment 1',
    serviceLevel: 1,
    identificationNumber: 'a-identification-number',
    manufacturingDate: '2014-06-30T15:18:51.000Z',
    links: {
      dealer: 'a-dealer-id',
      model: 'a-model-id'
    }
  };
};

global.respondWithFailure = (requestPromiseMock, result) => {
  td.when(requestPromiseMock).thenDo(() => Bluebird.reject(result));
};

global.readFixture = (fixtureName, partialObject) => {
  const fixture = JSON.parse(fs.readFileSync(`${__dirname}/fixtures/${fixtureName}Fixture.json`, 'utf8'));
  return Object.assign({}, fixture, partialObject);
};
