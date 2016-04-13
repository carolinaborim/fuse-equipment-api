import EquipmentController from './controllers/equipmentController';
import EquipmentValidator from './validators/equipment';

import Inert from 'inert';
import Vision from 'vision';
import Hapi from 'hapi';
import HapiSwagger from 'hapi-swagger';

const server = new Hapi.Server();
const PORT = process.env.PORT || 9090;

const app = (httpClient, telemetryAPI) => {
  const equipmentController = new EquipmentController(httpClient, telemetryAPI);
  const equipmentValidator = new EquipmentValidator();

  server.connection({
    host: '0.0.0.0',
    port: PORT
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
    path: '/equipment',
    handler: equipmentController.findAll.bind(equipmentController),
    config: {
      tags: ['api']
    }
  }, {
    method: 'GET',
    path: '/equipment/{id}',
    handler: equipmentController.findById.bind(equipmentController),
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
