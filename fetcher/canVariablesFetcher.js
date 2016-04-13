import config from '../config';
import rp from 'request-promise';

const defaultRequestOptions = {
  method: 'GET',
  json: true
};

const defaultCanVariableNames = [
'ENGINE_HOURS',
'ENGINE_SPEED',
'DRIVING_DIRECTION',
];

const createSearchUrl = () => {
  let equipmentId = 'ce88a25c-14b0-4eaa-88cc-0bee1c6f1025';
  let canVariableNames = defaultCanVariableNames.join(',');
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
  `&links.trackingPoint.equipment.id=${equipmentId}`;

  return requestUri;
}

class CanVariablesFetcher {
  constructor(httpClient) {
    this.httpClient = httpClient;
  }

  fetchByEquipmentId(id, authorizationBearer) {
    let options = Object.assign({
      uri: createSearchUrl(),
      headers: {
        Authorization: authorizationBearer
      }
    }, defaultRequestOptions);
    
    return this.httpClient(options)
      .then((data) => {
        let canVariables = {};
        data.meta.aggregations.equip_agg[0].spn_ag.forEach((data, index) => {
          canVariables[data.key] = data.spn_latest_ag[0].value;
        });

        return canVariables;
      })
      .catch(function (err) {
        console.log(err.error);
      });
  }
}


module.exports = CanVariablesFetcher;