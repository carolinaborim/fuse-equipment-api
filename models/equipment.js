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

module.exports = Equipment;
