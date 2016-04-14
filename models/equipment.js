const Equipment = () => {};

Equipment.parseEquipment = (telemetryEquipment, canVariablesInformations) => {
  return {
    type: 'equipment',
    id: telemetryEquipment.id,
    attributes: {
      description: telemetryEquipment.description,
      serviceLevel: telemetryEquipment.serviceLevel,
      identificationNumber: telemetryEquipment.identificationNumber,
      manufacturingDate: telemetryEquipment.manufacturingDate,
      informations: canVariablesInformations
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

module.exports = Equipment;
