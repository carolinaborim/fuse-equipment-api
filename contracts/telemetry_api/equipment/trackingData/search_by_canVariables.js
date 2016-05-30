import { Contract, Joi } from 'consumer-contracts';
import config from '../../../../contract_config';

module.exports = new Contract({
  name: 'Search by canVariables type',
  consumer: 'Telemetry API',
  request: {
    method: 'GET',
    headers: {
      authorization: config.ACCESS_TOKEN
    },
    url: `${config.TELEMETRY_API_URL}/trackingData/search?include=trackingPoint` +
      '&links.canVariable.name=ENGINE_HOURS' +
      '&aggregations=equip_agg' +
      '&equip_agg.property=links.trackingPoint.equipment.id' +
      '&equip_agg.aggregations=spn_ag%2Ctp_latest_ag' +
      '&spn_ag.property=links.canVariable.name' +
      '&spn_ag.aggregations=spn_latest_ag' +
      '&spn_latest_ag.type=top_hits&spn_latest_ag.sort=-links.trackingPoint.timeOfOccurrence' +
      '&spn_latest_ag.limit=1&spn_latest_ag.include=canVariable%2CcanVariable.standardUnit' +
      '&tp_latest_ag.type=top_hits&tp_latest_ag.sort=-links.trackingPoint.timeOfOccurrence' +
      '&tp_latest_ag.limit=1&tp_latest_ag.fields=links.trackingPoint' +
      '&tp_latest_ag.include=trackingPoint'
  },
  response: {
    statusCode: 200,
    body: Joi.object().keys({
      trackingData: Joi.array(),
      linked: Joi.object().keys({
        trackingPoints: Joi.array(),
        canVariables: Joi.array()
      }),
      meta: Joi.object().keys({
        aggregations: Joi.object().keys({
          equip_agg: Joi.array()
        })
      })
    })
  }
});

