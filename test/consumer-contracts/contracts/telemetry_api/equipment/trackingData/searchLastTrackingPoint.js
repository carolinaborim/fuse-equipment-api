import { Contract, Joi } from 'consumer-contracts';
import config from '../../../../contract_config';
import trackingDataSearchHelper from '../../../../../../src/helpers/trackingDataSearch';
import helper from '../../../../contract_helper';

const EQUIPMENT_ID = '7d7ceeb8-f628-45a1-b96d-587b3979f8ef';
const TRACKER_ID = '5818efa2-e095-430f-aef1-aaa2db38095e';

module.exports = new Contract({
  name: 'Search by last equipment trackingPoint and duty',
  consumer: 'Telemetry API',
  before: (done) => {
    helper.deleteEquipment(EQUIPMENT_ID)
    .then(() => {
      return helper.createEquipment(EQUIPMENT_ID);
    })
    .then(() => {
      return helper.deleteTracker(TRACKER_ID);
    })
    .then(() => {
      return helper.createTracker(TRACKER_ID, EQUIPMENT_ID);
    })
    .then(() => {
      return helper.createTrackingDatum(TRACKER_ID);
    })
    .catch(() => {})
    .finally(done);
  },
  request: {
    method: 'GET',
    headers: {
      authorization: config.ACCESS_TOKEN
    },
    url: trackingDataSearchHelper.searchLastDutyUrl(EQUIPMENT_ID)
  },
  response: {
    statusCode: 200,
    body: Joi.object().keys({
      trackingData: Joi.array().items({
        id: Joi.string(),
        raw: Joi.number(),
        value: Joi.string(),
        externalId: Joi.string(),
        links: Joi.object().keys({
          trackingPoint: Joi.string(),
          canVariable: Joi.string()
        })
      }),
      linked: Joi.object().keys({
        trackingPoints: Joi.array().items({
          id: Joi.string(),
          heading: Joi.number(),
          location: Joi.object(),
          timeOfOccurrence: Joi.string(),
          timeOfReception: Joi.string(),
          externalId: Joi.string()
        }),
        duties: Joi.array().items({
          id: Joi.string(),
          status: Joi.string()
        })
      }),
      meta: Joi.object().keys({
        aggregations: Joi.object().keys({
          equip_agg: Joi.array().items({
            key: Joi.string(),
            count: Joi.number(),
            tp_latest_ag: Joi.array()
          })
        })
      })
    })
  },
  after: (done) => {
    helper.deleteEquipment(EQUIPMENT_ID)
     .then(() => {
       return helper.deleteTracker(TRACKER_ID);
     })
    .catch(() => {})
    .finally(done);
  }
});

