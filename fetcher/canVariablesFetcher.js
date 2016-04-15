import config from '../config';
import ResponseHandler from '../handlers/responseHandler';

const defaultRequestOptions = {
  method: 'GET',
  json: true
};

const defaultCanVariableNames = [
'ENGINE_HOURS',
'ENGINE_SPEED',
'DRIVING_DIRECTION',
];

const createSearchUrl = (equipmentIds) => {
  let canVariableNames = defaultCanVariableNames.join(',');
  let ids = equipmentIds.join(',');
  let requestUri = `${config.TELEMETRY_API_URL}/trackingData/search?include=trackingPoint`+
  `&links.canVariable.name=${canVariableNames}`+
  '&aggregations=equip_agg'+
  '&equip_agg.property=links.trackingPoint.equipment.id'+
  '&equip_agg.aggregations=spn_ag%2Ctp_latest_ag'+
  '&spn_ag.property=links.canVariable.name'+
  '&spn_ag.aggregations=spn_latest_ag'+
  '&spn_latest_ag.type=top_hits&spn_latest_ag.sort=-links.trackingPoint.timeOfOccurrence'+
  '&spn_latest_ag.limit=1&spn_latest_ag.include=canVariable%2CcanVariable.standardUnit'+
  '&tp_latest_ag.type=top_hits&tp_latest_ag.sort=-links.trackingPoint.timeOfOccurrence'+
  '&tp_latest_ag.limit=1&tp_latest_ag.fields=links.trackingPoint'+
  '&tp_latest_ag.include=trackingPoint'+
  `&links.trackingPoint.equipment.id=${ids}`;

  return requestUri;
}

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
    
    return this.httpClient(options)
      .then((data) => {
        let canVariables = {};
        data.meta.aggregations.equip_agg.forEach((data, index) => {
          canVariables[data.key] = {};
          data.spn_ag.forEach((aggData, index) => {
            canVariables[data.key][aggData.key] = aggData.spn_latest_ag[0].value;
          });
        });
        return canVariables;
      })
      .catch(function (err) {
        throw new Error(err);
      });
  }
}


module.exports = CanVariablesFetcher;