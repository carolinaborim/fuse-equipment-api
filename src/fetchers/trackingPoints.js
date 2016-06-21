import _ from 'lodash';
import trackingDataSearchHelper from '../helpers/trackingDataSearch';
import config from '../config';

class TrackingPointFetcher {
  constructor(httpClient) {
    this.httpClient = httpClient;
  }

  urlFor(equipmentIds) {
    const ids = equipmentIds.join(',');
    return trackingDataSearchHelper.searchLastDutyUrl(ids);
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

    return this.httpClient(request).then((data) => {
      const equipment = {};

      if (data.linked) {
        const trackingPoints = data.linked.trackingPoints;
        const duties = data.linked.duties;

        data.meta.aggregations.equip_agg.forEach((aggEquipment) => {
          const trackingPointId = _.first(aggEquipment.tp_latest_ag).links.trackingPoint;
          const trackingPoint = _.find(trackingPoints, { id: trackingPointId });
          trackingPoint.status = _.find(duties, { id: trackingPoint.links.duty }).status;
          equipment[aggEquipment.key] = trackingPoint;
        });
      }

      return equipment;
    })
    .catch((err) => {
      throw new Error(err);
    });
  }
}

module.exports = TrackingPointFetcher;
