import config from '../config';
import _ from 'lodash';


class TrackingPointFetcher {
  constructor(httpClient) {
    this.httpClient = httpClient;
  }

  urlFor(equipmentIds) {
    const ids = equipmentIds.join(',');

    return `${config.TELEMETRY_API_URL}/trackingData/search` +
      '?include=trackingPoint,trackingPoint.duty' +
      '&aggregations=equip_agg&equip_agg.property=links.trackingPoint.equipment.id' +
      '&equip_agg.aggregations=tp_latest_ag&tp_latest_ag.type=top_hits' +
      '&tp_latest_ag.sort=-links.trackingPoint.timeOfOccurrence&tp_latest_ag.limit=1' +
      '&tp_latest_ag.fields=links.trackingPoint&tp_latest_ag.include=trackingPoint' +
      `&links.trackingPoint.equipment.id=${ids}`;
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
