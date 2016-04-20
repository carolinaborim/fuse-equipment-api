import EquipmentController from './controllers/equipmentController';
import EquipmentValidator from './validators/equipment';
import EquipmentSchema from './schemas/equipmentSchema';
import config from './config';

import Inert from 'inert';
import Vision from 'vision';
import Hapi from 'hapi';
import HapiSwagger from 'hapi-swagger';

const app = (httpClient, telemetryAPI) => {
  const server = new Hapi.Server();
  const equipmentController = new EquipmentController(httpClient, telemetryAPI);

  server.connection({
    host: '0.0.0.0',
    port: config.PORT
  });

  server.register([
    Inert,
    Vision,
    {
      register: HapiSwagger,
      options: config.HAPI_SWAGGER_CONFIG
    }]);

  server.route([{
    method: 'GET',
    path: '/equipments',
    config: {
      handler: (request, reply) => {
        equipmentController.findAll(request, reply);
      },
      tags: ['api'],
      validate: EquipmentValidator.findAll,
      plugins: EquipmentSchema.findAll
    }
  }, {
    method: 'GET',
    path: '/equipments/{id}',
    config: {
      handler: (request, reply) => {
        equipmentController.findById(request, reply);
      },
      tags: ['api'],
      validate: EquipmentValidator.findById,
      plugins: EquipmentSchema.findById
    }
  }]);

  return server;
};

module.exports = app;
