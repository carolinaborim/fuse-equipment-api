import Equipment from '../models/equipment';
import Joi from 'joi';

const equipment = new Equipment();

const EquipmentController = (httpClient, telemetryAPI) => {
  EquipmentController.httpClient = httpClient;
  EquipmentController.telemetryAPI = telemetryAPI;
  EquipmentController.defaultEquipment = {
    equipment: [
      {
        id: '6c8a1f3b-94aa-447a-8168-a3c10cbec9ba',
        description: 'Sandbox Equipment 1',
        serviceLevel: 1,
        identificationNumber: '1460401079344',
        manufacturingDate: '2014-06-30T15:18:51.000Z',
        links: {
          dealer: 'a6d1ccee-6a54-4086-aec9-3ea4f075a760',
          model: 'ffbfa8e6-aa5e-4572-8820-32adc97c8dc4'
        }
      }
    ]
  };
};

EquipmentController.prototype.findAll = (request, reply) => {
  return EquipmentController.httpClient({
    method: 'GET',
    json: true,
    url: `${EquipmentController.telemetryAPI}/equipment`,
    headers: {
      Authorization: request.headers.authorization
    }
  })
  .then((response) => {
    console.log(response);
    return reply({
      data: []
    });
  })
  .catch((err) => {
    console.log(err);
    return reply({
      error: err
    });
  });
};

EquipmentController.prototype.findById = (request, reply) => {
  const defaultEquipment = EquipmentController.defaultEquipment;
  const validatedEquipment = Joi.validate(
    defaultEquipment,
    equipment.schema,
    (err, validatedEntity) => {
      if (err) {
        console.log(err);
        return null;
      }

      return validatedEntity;
    });

  return reply(validatedEquipment);
};

module.exports = EquipmentController;
