'use strict'; // eslint-disable-line strict

import config from './contract_config';
import requestPromise from 'request-promise';

const DEFAULT_EQUIPMENT_ID = '44446DAE-16C1-11E6-A433-13F4FA00A427';

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

module.exports = {
  EQUIPMENT_ID: DEFAULT_EQUIPMENT_ID,
  createEquipment,
  deleteEquipment
};
