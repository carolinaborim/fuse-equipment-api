import RootController from './controllers/root';
import EquipmentController from './controllers/equipment';
import EquipmentValidator from './validators/equipment';
import EquipmentSchema from './schemas/equipment';
import config from './config';
import Inert from 'inert';
import Vision from 'vision';
import Hapi from 'hapi';
import HapiSwagger from 'hapi-swagger';
import corsHeaders from 'hapi-cors-headers';

import UserInfoTransformer from './metrics/transformers/userInfo';
import ResponseTimeTransformer from './metrics/transformers/responseTime';
import ResponseTimeExtractor from './metrics/extractors/responseTime';

const app = (equipmentFetcher,
             canVariablesFetcher,
             trackingPointFetcher,
             userInfoFetcher,
             logger) => {
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

  const userInfoTransformer = new UserInfoTransformer();
  const responseTimeTransformer = new ResponseTimeTransformer();
  const responseTimeExtractor = new ResponseTimeExtractor(
    userInfoFetcher,
    userInfoTransformer,
    responseTimeTransformer
  );
  server.on('response', (request) => {
    if (request.headers.authorization) {
      responseTimeExtractor.extract(request)
      .then((data) => {
        logger.info(data);
      });
    }
  });

  server.register([
    Inert,
    Vision,
    {
      register: HapiSwagger,
      options: config.HAPI_SWAGGER_CONFIG
    }
  ]);

  server.ext('onPreResponse', corsHeaders);

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
