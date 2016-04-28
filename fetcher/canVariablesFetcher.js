import config from '../config';
import _ from 'lodash';

class CanVariablesFetcher {
  constructor(httpClient) {
    this.httpClient = httpClient;
  }

  urlFor(equipmentIds) {
    const canVariableNames = config.DEFAULT_CAN_VARIABLES.join(',');
    const ids = equipmentIds.join(',');

    return `${config.TELEMETRY_API_URL}/trackingData/search?include=trackingPoint` +
      `&links.canVariable.name=${canVariableNames}` +
      '&aggregations=equip_agg' +
      '&equip_agg.property=links.trackingPoint.equipment.id' +
      '&equip_agg.aggregations=spn_ag%2Ctp_latest_ag' +
      '&spn_ag.property=links.canVariable.name' +
      '&spn_ag.aggregations=spn_latest_ag' +
      '&spn_latest_ag.type=top_hits&spn_latest_ag.sort=-links.trackingPoint.timeOfOccurrence' +
      '&spn_latest_ag.limit=1&spn_latest_ag.include=canVariable%2CcanVariable.standardUnit' +
      '&tp_latest_ag.type=top_hits&tp_latest_ag.sort=-links.trackingPoint.timeOfOccurrence' +
      '&tp_latest_ag.limit=1&tp_latest_ag.fields=links.trackingPoint' +
      '&tp_latest_ag.include=trackingPoint' +
      `&links.trackingPoint.equipment.id=${ids}`;
  }

  fetchByEquipmentId(equipmentIds, authorizationBearer) {
    let request = {
      url: this.urlFor(equipmentIds),
      method: 'GET',
      json: true,
      headers: {
        Authorization: authorizationBearer
      },
      timeout: config.TIMEOUT
    };

    let equipments = {};

    return this.httpClient(request)
      .then((data) => {
        data.meta.aggregations.equip_agg.forEach((data, index) => {
          equipments[data.key] = {};
          data.spn_ag.forEach((aggData, index) => {
            equipments[data.key][aggData.key] = _.first(aggData.spn_latest_ag).value;
          });
        });

        return equipments;
      }).catch(function (err) {
        throw new Error(err);
      });
  }
}


module.exports = CanVariablesFetcher;
