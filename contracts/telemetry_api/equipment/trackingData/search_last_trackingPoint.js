import { Contract, Joi } from 'consumer-contracts';
import config from '../../../../contract_config';

module.exports = new Contract({
  name: 'Search by last equipment trackingPoint and duty',
  consumer: 'Telemetry API',
  request: {
    method: 'GET',
    headers: {
      authorization: config.ACCESS_TOKEN
    },
    url: `${config.TELEMETRY_API_URL}/trackingData/search` +
      '?include=trackingPoint,trackingPoint.duty' +
      '&aggregations=equip_agg&equip_agg.property=links.trackingPoint.equipment.id' +
      '&equip_agg.aggregations=tp_latest_ag&tp_latest_ag.type=top_hits' +
      '&tp_latest_ag.sort=-links.trackingPoint.timeOfOccurrence&tp_latest_ag.limit=1' +
      '&tp_latest_ag.fields=links.trackingPoint&tp_latest_ag.include=trackingPoint'
  },
  response: {
    statusCode: 200,
    body: Joi.object().keys({
      trackingData: Joi.array(),
      linked: Joi.object().keys({
        trackingPoints: Joi.array(),
        duties: Joi.array()
      }),
      meta: Joi.object().keys({
        aggregations: Joi.object().keys({
          equip_agg: Joi.array()
        })
      })
    })
  }
});

