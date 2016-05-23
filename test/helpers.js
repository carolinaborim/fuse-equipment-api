import Bluebird from 'bluebird';
import fs from 'fs';
import td from 'testdouble';

const FUSE_TELEMETRY_API_URL = 'https://agco-fuse-trackers-sandbox.herokuapp.com';
const generateTelemetryEquipment = (equipmentId) => {
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
const readFixture = (fixtureName, partialObject) => {
  const fixture = JSON.parse(fs.readFileSync(`${__dirname}/fixtures/${fixtureName}Fixture.json`, 'utf8'));
  return Object.assign({}, fixture, partialObject);
};
const respondWithSuccess = (requestPromiseMock, result) => {
  td.when(requestPromiseMock).thenDo(() => Bluebird.resolve(result));
};
const respondWithFailure = (requestPromiseMock, result) => {
  td.when(requestPromiseMock).thenDo(() => Bluebird.reject(result));
};

module.exports = {
  FUSE_TELEMETRY_API_URL,
  generateTelemetryEquipment,
  readFixture,
  respondWithFailure,
  respondWithSuccess
};
