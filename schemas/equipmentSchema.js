import Joi from 'joi';

const trackingPoint = Joi.object().keys({
  location: Joi.object().keys({
    coordinates: Joi.array(),
    type: Joi.string()
  }).label('location'),
  status: Joi.string()
}).label('trackingPoint');

const trackingData = Joi.object().label('trackingData');

const dealer = Joi.object().keys({
  links: Joi.object().keys({
    self: Joi.string(),
    related: Joi.string()
  }).label('dealerLinks'),
  data: Joi.object().keys({
    type: Joi.string(),
    id: Joi.string()
  }).label('dealerData')
}).label('dealer');

const model = Joi.object().keys({
  links: Joi.object().keys({
    self: Joi.string(),
    related: Joi.string()
  }).label('equipmentModelLinks'),
  data: Joi.object().keys({
    type: Joi.string(),
    id: Joi.string()
  }).label('equipmentModelData')
}).label('equipmentModel');

const equipmentAttributes = Joi.object().keys({
  description: Joi.string(),
  serviceLevel: Joi.number().integer(),
  identificationNumber: Joi.string(),
  manufacturingDate: Joi.date(),
  trackingPoint,
  trackingData
}).label('equipmentAttributes');

const equipmentRelationships = Joi.object().keys({
  dealer,
  model
}).label('equipmentRelationships');

const equipment = Joi.object().keys({
  type: Joi.string(),
  id: Joi.string(),
  attributes: equipmentAttributes,
  relationships: equipmentRelationships
}).label('equipment');

const findById = Joi.object().keys({
  data: equipment
}).label('anEquipmentData');

const findAll = Joi.object().keys({
  data: Joi.array().items(equipment)
}).label('equipmentData');

const unauthorized = Joi.object().keys({
  errors: Joi.array().items(
    Joi.object().keys({
      status: 401,
      title: 'Unauthorized'
    }).label('unauthorizedError')
  ).label('unauthorizedErrors')
}).label('401');

const notFound = Joi.object().keys({
  errors: Joi.array().items(
    Joi.object().keys({
      status: 404,
      title: 'Resource not found.'
    }).label('resourceNotFound')
  ).label('resourcesNotFound')
}).label('404');

const unhandledError = Joi.object().keys({
  errors: Joi.array().items(
    Joi.object().keys({
      status: 500,
      title: 'An unhandled error occurred'
    }).label('unhandledError')
  ).label('unhandledErrors')
}).label('500');

const generateSwaggerSchemas = (entitySchema) => {
  return {
    'hapi-swagger': {
      responses: {
        200: {
          description: 'Success',
          schema: entitySchema
        },
        401: {
          description: 'Unauthorized',
          schema: unauthorized
        },
        404: {
          description: 'Not Found',
          schema: notFound
        },
        500: {
          description: 'Unhandled Error',
          schema: unhandledError
        }
      }
    }
  };
};

module.exports = {
  findById: generateSwaggerSchemas(findById),
  findAll: generateSwaggerSchemas(findAll)
};
