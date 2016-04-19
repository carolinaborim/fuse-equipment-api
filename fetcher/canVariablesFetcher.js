import config from '../config';
import ResponseHandler from '../handlers/responseHandler';
import _ from 'lodash';

const defaultRequestOptions = {
  method: 'GET',
  json: true
};

const createSearchUrl = (equipmentIds) => {
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
};

const createSearchTrackingPointUrl = (equipmentIds) => {
  const ids = equipmentIds.join(',');

  return `${config.TELEMETRY_API_URL}/trackingData/search` +
    '?include=trackingPoint,trackingPoint.duty' +
    '&aggregations=equip_agg&equip_agg.property=links.trackingPoint.equipment.id' +
    '&equip_agg.aggregations=tp_latest_ag&tp_latest_ag.type=top_hits' +
    '&tp_latest_ag.sort=-links.trackingPoint.timeOfOccurrence&tp_latest_ag.limit=1' +
    '&tp_latest_ag.fields=links.trackingPoint&tp_latest_ag.include=trackingPoint' +
    `&links.trackingPoint.equipment.id=${ids}`;
};

class CanVariablesFetcher {
  constructor(httpClient) {
    this.httpClient = httpClient;
  }

  fetchByEquipmentId(equipmentIds, authorizationBearer) {
    let options = Object.assign({
      uri: createSearchUrl(equipmentIds),
      headers: {
        Authorization: authorizationBearer
      }
    }, defaultRequestOptions);

    let equipments = {};

    return this.httpClient(options)
      .then((data) => {
        data.meta.aggregations.equip_agg.forEach((data, index) => {
          equipments[data.key] = {
            trackingData: {}
          };
          data.spn_ag.forEach((aggData, index) => {
            equipments[data.key].trackingData[aggData.key] = _.first(aggData.spn_latest_ag).value;
          });
        });

        options.uri = createSearchTrackingPointUrl(equipmentIds);

        return this.httpClient(options);
      })
      .then((data) => {
        if(data.linked) {
          let trackingPoints = data.linked.trackingPoints;
          let duties = data.linked.duties;

          data.meta.aggregations.equip_agg.forEach((data, index) => {
            let trackingPointId = _.first(data.tp_latest_ag).links.trackingPoint;
            let trackingPoint = _.find(trackingPoints, { id: trackingPointId });
            trackingPoint.status = _.find(duties, { id: trackingPoint.links.duty }).status; 
            equipments[data.key].trackingPoint = trackingPoint;
          });
        }      
        return equipments;
      })
      .catch(function (err) {
        throw new Error(err);
      });
  }
}


module.exports = CanVariablesFetcher;