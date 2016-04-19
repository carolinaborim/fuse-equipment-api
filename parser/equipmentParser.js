const parseTrackingPoint = (data) => {
  if(!data.trackingPoint) {
    return {};
  }

  return {
    location: data.trackingPoint.location,
    status: data.trackingPoint.status
  }
};

const EquipmentParser = () => {};

EquipmentParser.parse = (telemetryEquipment, canVariablesInformations = {}) => {

  return {
    type: 'equipment',
    id: telemetryEquipment.id,
    attributes: {
      description: telemetryEquipment.description,
      serviceLevel: telemetryEquipment.serviceLevel,
      identificationNumber: telemetryEquipment.identificationNumber,
      manufacturingDate: telemetryEquipment.manufacturingDate,
      trackingPoint: parseTrackingPoint(canVariablesInformations),
      trackingData: canVariablesInformations.trackingData || {}
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
