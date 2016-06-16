import config from './contract_config';
import requestPromise from 'request-promise';

const DEFAULT_EQUIPMENT_ID = '44446DAE-16C1-11E6-A433-13F4FA00A427';
const DEFAULT_TRACKER_SERIAL = '123433455';
const DEFAULT_TRACKER_DEVICE_ID = '1234555553';

const createEquipment = (equipmentId = DEFAULT_EQUIPMENT_ID) => {
  return requestPromise({
    uri: `${config.TELEMETRY_API_URL}/equipment`,
    method: 'POST',
    json: true,
    headers: { authorization: config.ACCESS_TOKEN },
    body: {
      equipment: [{
        id: equipmentId,
        serviceLevel: 4,
        manufacturingDate: '2014-06-30T15:18:51.000Z',
        identificationNumber: Math.floor((Math.random() * 100000000) + 1).toString(),
        description: 'Gleaner R Series R66 - Harvester',
        links: {
          model: 'a88ebfa4-46e7-4c6d-95a8-f357c416b5ae'
        }
      }]
    }
  });
};

const deleteEquipment = (equipmentId = DEFAULT_EQUIPMENT_ID) => {
  return requestPromise({
    uri: `${config.TELEMETRY_API_URL}/equipment/${equipmentId}`,
    method: 'DELETE',
    headers: { authorization: config.ACCESS_TOKEN }
  });
};

const createTracker = (trackerId, equipmentId) => {
  return requestPromise({
    uri: `${config.TELEMETRY_API_URL}/trackers`,
    method: 'POST',
    json: true,
    headers: {
      authorization: config.ACCESS_TOKEN
    },
    body: {
      trackers: [{
        id: trackerId,
        activated: true,
        name: 'contract test tracker',
        serialNumber: DEFAULT_TRACKER_SERIAL,
        deviceId: DEFAULT_TRACKER_DEVICE_ID,
        firmwareVersion: '12',
        links: {
          equipment: equipmentId
        }
      }]
    }
  });
};

const deleteTracker = (trackerId) => {
  return requestPromise({
    uri: `${config.TELEMETRY_API_URL}/trackers/${trackerId}`,
    method: 'DELETE',
    headers: { authorization: config.ACCESS_TOKEN }
  });
};

const createTrackingDatum = (trackerId) => {
  return requestPromise({
    uri: `${config.TELEMETRY_API_URL}/topcon/positionlist`,
    method: 'POST',
    json: true,
    headers: {
      authorization: config.ACCESS_TOKEN
    },
    body: {
      id: trackerId,
      deviceId: DEFAULT_TRACKER_DEVICE_ID,
      positions: [{
        timestamp: '2015-02-05T19:04:57.452Z',
        longitude: 38,
        latitude: 32,
        speed: 19,
        heading: 185,
        altitude: 400,
        machineStatus: 0,
        canVariables: [{
          spn: 247,
          value: 1000
        }],
        statusInfo: [],
        canAlarms: []
      }]
    }
  });
};

module.exports = {
  EQUIPMENT_ID: DEFAULT_EQUIPMENT_ID,
  createEquipment,
  deleteEquipment,
  createTracker,
  deleteTracker,
  createTrackingDatum
};
