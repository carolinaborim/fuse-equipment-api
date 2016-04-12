import Joi from 'joi';

const EquipmentValidator = () => {};

EquipmentValidator.prototype.validateGetParams = () => {
  return {
    id: Joi.number().integer()
  };
};

module.exports = EquipmentValidator;
