import { Contract, Joi } from 'consumer-contracts';
import config from '../../../../contract_config';

module.exports = new Contract({
  name: 'Get list of equipment',
  consumer: 'Telemetry API',
  request: {
    method: 'GET',
    headers: {
      authorization: config.ACCESS_TOKEN
    },
    url: `${config.TELEMETRY_API_URL}/equipment`
  },
  response: {
    statusCode: 200,
    body: Joi.object().keys({
      equipment: Joi.array().items(Joi.object().keys({
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
  }
});
