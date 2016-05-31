import config from '../config';
import _ from 'lodash';
import trackingDataSearchParser from '../parser/trackingDataSearchParser';

class CanVariablesFetcher {
  constructor(httpClient) {
    this.httpClient = httpClient;
  }

  urlFor(equipmentIds) {
    const canVariableNames = config.DEFAULT_CAN_VARIABLES.join(',');
    const ids = equipmentIds.join(',');

    return trackingDataSearchParser.parseSearchByCANVariablesUrl(canVariableNames, ids);
  }

  fetchByEquipmentId(equipmentIds, authorizationBearer) {
    const request = {
      url: this.urlFor(equipmentIds),
      method: 'GET',
      json: true,
      headers: {
        Authorization: authorizationBearer
      },
      timeout: config.TIMEOUT
    };

    const equipment = {};

    return this.httpClient(request)
      .then((data) => {
        data.meta.aggregations.equip_agg.forEach((aggEquipment) => {
          equipment[aggEquipment.key] = {};
          aggEquipment.spn_ag.forEach((aggData) => {
            equipment[aggEquipment.key][aggData.key] = _.first(aggData.spn_latest_ag).value;
          });
        });

        return equipment;
      })
      .catch((err) => {
        throw new Error(err);
      });
  }
}


module.exports = CanVariablesFetcher;
