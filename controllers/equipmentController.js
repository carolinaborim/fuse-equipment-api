import Equipment from '../models/equipment';
import Joi from 'joi';

const responseWithError = (request, reply) => (err) => {
  const response = reply(err.response.body);
  response.statusCode = 401;
  return response;
}

const responseWithEquipments = (request, reply) => (equipments) => {
  let data = equipments.equipment.map((equipment) => {
    return {
      type: 'equipment',
      id: equipment.id,
      attributes: {
        description: equipment.description,
        serviceLevel: equipment.serviceLevel,
        identificationNumber: equipment.identificationNumber,
        manufacturingDate: equipment.manufacturingDate
      },
      relationships: {
        dealer: {
          links: {
            self: '',
            related: ''
          },
          data: {
            type: 'dealer',
            id: equipment.links.dealer
          }
        },
        model: {
          links: {
            self: '',
            related: ''
          },
          data: {
            type: 'model',
            id: equipment.links.model
          }
        }
      }
    };
  });

  return reply({
    data: data
  });
};

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
  .then(responseWithEquipments(request, reply))
  .catch(responseWithError(request, reply));
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
