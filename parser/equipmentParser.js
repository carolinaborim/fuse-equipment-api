const parseTrackingPoint = (data) => {
  if(!data) {
    return {};
  }

  return {
    location: data.location,
    status: data.status
  }
};

const EquipmentParser = () => {};

EquipmentParser.parse = (telemetryEquipment, trackingData = {}, trackingPoint = {}) => {

  return {
    type: 'equipment',
    id: telemetryEquipment.id,
    attributes: {
      description: telemetryEquipment.description,
      serviceLevel: telemetryEquipment.serviceLevel,
      identificationNumber: telemetryEquipment.identificationNumber,
      manufacturingDate: telemetryEquipment.manufacturingDate,
      trackingPoint: parseTrackingPoint(trackingPoint),
      trackingData: trackingData || {}
    },
    relationships: {
      dealer: {
        links: {
          self: '',
          related: ''
        },
        data: {
          type: 'dealer',
          id: telemetryEquipment.links.dealer
        }
      },
      model: {
        links: {
          self: '',
          related: ''
        },
        data: {
          type: 'model',
          id: telemetryEquipment.links.model
        }
      }
    }
  };
};

module.exports = EquipmentParser;
