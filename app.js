import EquipmentController from './controllers/equipmentController';
import EquipmentValidator from './validators/equipment';
import EquipmentSchema from './schemas/equipmentSchema';
import config from './config';

import Inert from 'inert';
import Vision from 'vision';
import Hapi from 'hapi';
import HapiSwagger from 'hapi-swagger';

const app = (equipmentFetcher, canVariablesFetcher, trackingPointFetcher) => {
  const server = new Hapi.Server();

  const equipmentController = new EquipmentController(equipmentFetcher, canVariablesFetcher, trackingPointFetcher);

  server.connection({
    host: '0.0.0.0',
    port: config.PORT,
    routes: {
      cors: true
    }
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
    path: '/equipment',
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
    path: '/equipment/{id}',
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
