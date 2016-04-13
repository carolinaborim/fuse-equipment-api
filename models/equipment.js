import Joi from 'joi';

const Equipment = () => {};

Equipment.prototype.schema = Joi.object().keys({
  equipment: Joi.array().items(
    Joi.object().keys({
      id: Joi.string().required(),
      description: Joi.string(),
      serviceLevel: Joi.number().integer().required(),
      identificationNumber: Joi.number().integer().required(),
      manufacturingDate: Joi.date(),
      links: Joi.object().keys({
        dealer: Joi.string(),
        model: Joi.string()
      })
    })
  )
});

Equipment.prototype.parseEquipment = (telemetryEquipment) => {
  return {
    type: 'equipment',
    id: telemetryEquipment.id,
    attributes: {
      description: telemetryEquipment.description,
      serviceLevel: telemetryEquipment.serviceLevel,
      identificationNumber: telemetryEquipment.identificationNumber,
      manufacturingDate: telemetryEquipment.manufacturingDate
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
