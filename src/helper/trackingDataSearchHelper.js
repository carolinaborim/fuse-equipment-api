import config from '../config';

const searchLastDutyUrl = (equipmentIds) => {
  return `${config.TELEMETRY_API_URL}/trackingData/search` +
    '?include=trackingPoint,trackingPoint.duty' +
    '&aggregations=equip_agg&equip_agg.property=links.trackingPoint.equipment.id' +
    '&equip_agg.aggregations=tp_latest_ag&tp_latest_ag.type=top_hits' +
    '&tp_latest_ag.sort=-links.trackingPoint.timeOfOccurrence&tp_latest_ag.limit=1' +
    '&tp_latest_ag.fields=links.trackingPoint&tp_latest_ag.include=trackingPoint' +
    `&links.trackingPoint.equipment.id=${equipmentIds}`;
};

const searchByCANVariablesUrl = (canVariableNames, equipmentIds) => {
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
    `&links.trackingPoint.equipment.id=${equipmentIds}`;
};

module.exports = {
  searchLastDutyUrl,
  searchByCANVariablesUrl
};
