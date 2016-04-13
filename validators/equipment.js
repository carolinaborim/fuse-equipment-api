import Joi from 'joi';

const EquipmentValidator = () => {};

EquipmentValidator.prototype.validateGetParams = () => {
  return {
    id: Joi.string()
  };
};

module.exports = EquipmentValidator;
