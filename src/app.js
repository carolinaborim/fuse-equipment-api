import RootController from './controllers/rootController';
import EquipmentController from './controllers/equipmentController';
import EquipmentValidator from './validators/equipment';
import EquipmentSchema from './schemas/equipmentSchema';
import config from './config';

import Inert from 'inert';
import Vision from 'vision';
import Hapi from 'hapi';
import HapiSwagger from 'hapi-swagger';

import ClientInformationTransformer from './metrics/transformers/clientInformationTransformer';
import ApiResponseTimeExtractor from './metrics/apiResponseTimeExtractor';

const app = (equipmentFetcher,
             canVariablesFetcher,
             trackingPointFetcher,
             clientInformationFetcher) => {
  const server = new Hapi.Server();

  const rootController = new RootController();
  const equipmentController = new EquipmentController(equipmentFetcher, canVariablesFetcher, trackingPointFetcher);

  server.connection({
    host: '0.0.0.0',
    port: config.PORT,
    routes: {
      cors: true
    }
  });

  const clientInformationTransformer = new ClientInformationTransformer();
  const apiResponseTimeExtractor = new ApiResponseTimeExtractor(
    clientInformationFetcher,
    clientInformationTransformer
  );
  server.on('response', (request) => {
    apiResponseTimeExtractor.extract(request)
    .then((data) => {
      console.log(data);
    });
  });

  server.register([
    Inert,
    Vision,
    {
      register: HapiSwagger,
      options: config.HAPI_SWAGGER_CONFIG
    }]);

  server.route([{
    path: '/',
    method: 'OPTIONS',
    config: {
      handler: (request, reply) => {
        rootController.options(request, reply);
      }
    }
  }, {
    path: '/',
    method: 'GET',
    config: {
      handler: (request, reply) => {
        rootController.findAll(request, reply);
      }
    }
  }, {
    path: '/equipment',
    method: 'OPTIONS',
    config: {
      handler: (request, reply) => {
        equipmentController.options(request, reply);
      }
    }
  }, {
    path: '/equipment',
    method: 'GET',
    config: {
      handler: (request, reply) => {
        equipmentController.findAll(request, reply);
      },
      tags: ['api'],
      validate: EquipmentValidator.findAll,
      plugins: EquipmentSchema.findAll
    }
  }, {
    path: '/equipment/{id}',
    method: 'GET',
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
