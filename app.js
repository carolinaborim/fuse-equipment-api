import EquipmentController from './controllers/equipmentController';
import EquipmentValidator from './validators/equipment';
import config from './config';

import Inert from 'inert';
import Vision from 'vision';
import Hapi from 'hapi';
import HapiSwagger from 'hapi-swagger';

const app = (httpClient, telemetryAPI) => {
  const server = new Hapi.Server();
  const equipmentController = new EquipmentController(httpClient, telemetryAPI);
  const equipmentValidator = new EquipmentValidator();

  server.connection({
    host: '0.0.0.0',
    port: config.PORT
  });

  server.register([
    Inert,
    Vision,
    {
      register: HapiSwagger,
      options: {
        info: {
          version: '1.0.0'
        }
      }
    }]);

  server.route([{
    method: 'GET',
    path: '/equipments',
    handler: (request, reply) => {
      return equipmentController.findAll(request, reply);
    },
    config: {
      tags: ['api']
    }
  }, {
    method: 'GET',
    path: '/equipments/{id}',
    handler: (request, reply) => {
      return equipmentController.findById(request, reply);
    },
    config: {
      tags: ['api'],
      validate: {
        params: equipmentValidator.validateGetParams()
      }
    }
  }]);

  return server;
};

module.exports = app;
