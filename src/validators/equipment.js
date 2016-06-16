import Joi from 'joi';

const findAll = {
  offset: Joi.number().integer()
    .default('0')
    .description('Paging offset'),
  limit: Joi.number().integer()
    .default('100')
    .description('Paging limit')
};

const findById = {
  id: Joi.string()
    .required()
    .description('Equipment ID')
};

const headers = Joi.object().keys({
  authorization: Joi.string().required()
}).unknown();

module.exports = {
  findAll: {
    params: findAll,
    headers
  },
  findById: {
    params: findById,
    headers
  }
};
