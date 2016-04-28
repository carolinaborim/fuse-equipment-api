import Joi from 'joi';

const Equipment = Joi.object().keys({
  type: Joi.string(),
  id: Joi.string(),
  attributes: Joi.object().keys({
    description: Joi.string(),
    serviceLevel: Joi.number().integer(),
    identificationNumber: Joi.string(),
    manufacturingDate: Joi.date(),
    trackingPoint: Joi.object().keys({
      location: Joi.object().keys({
        coordinates: Joi.array(),
        type: Joi.string()
      }),
      status: Joi.string()
    }),
    trackingData: Joi.object()
  }),
  relationships: Joi.object().keys({
    dealer: Joi.object().keys({
      links: Joi.object().keys({
        self: Joi.string(),
        related: Joi.string()
      }),
      data: Joi.object().keys({
        type: Joi.string(),
        id: Joi.string()
      })
    }),
    model: Joi.object().keys({
      links: Joi.object().keys({
        self: Joi.string(),
        related: Joi.string()
      }),
      data: Joi.object().keys({
        type: Joi.string(),
        id: Joi.string()
      })
    })
  })
});

const findById = Joi.object().keys({
  data: Equipment
});

const findAll = Joi.object().keys({
  data: Joi.array().items(Equipment)
});

const unauthorized = Joi.object().keys({
  errors: Joi.array().items(
    Joi.object().keys({
      status: 401,
      title: 'Unauthorized'
    })
  )
});

const notFound = Joi.object().keys({
  errors: Joi.array().items(
    Joi.object().keys({
      status: 404,
      title: 'Resource not found.'
    })
  )
});

const unhandledError = Joi.object().keys({
  errors: Joi.array().items(
    Joi.object().keys({
      status: 500,
      title: 'An unhandled error occurred'
    })
  )
});

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
