import { Contract, Joi } from 'consumer-contracts';
import config from '../../../../contract_config';
import helper from '../../../../contract_helper';

module.exports = new Contract({
  name: 'Get one equipment by ID',
  consumer: 'Telemetry API',
  before: (done) => {
    helper.deleteEquipment()
      .then(() => {
        return helper.createEquipment();
      })
      .finally(done);
  },
  request: {
    method: 'GET',
    headers: {
      authorization: config.ACCESS_TOKEN
    },
    url: `${config.TELEMETRY_API_URL}/equipment/${helper.EQUIPMENT_ID}`
  },
  response: {
    statusCode: 200,
    body: Joi.object().keys({
      equipment: Joi.array().min(1).max(1).items(Joi.object().keys({
        id: Joi.string(),
        description: Joi.string(),
        serviceLevel: Joi.number().integer(),
        identificationNumber: Joi.string(),
        manufacturingDate: Joi.date().iso(),
        links: Joi.object().keys({
          dealer: Joi.string().optional(),
          manufacturingModel: Joi.string().optional(),
          model: Joi.string(),
          owner: Joi.string().optional()
        })
      }))
    })
  },
  after: (done) => {
    helper.deleteEquipment()
      .finally(done);
  }
});
