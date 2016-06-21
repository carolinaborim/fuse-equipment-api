const ResponseHandler = () => {};

const errorHandler = {
  401: (err) => {
    return {
      statusCode: 401,
      response: {
        errors: [{
          status: err.response.statusCode,
          title: err.response.body
        }]
      }
    };
  },
  404: (err) => {
    const getErrors = (response) => {
      if (response.headers &&
          response.headers['content-type'] &&
          response.headers['content-type'] === 'application/json') {
        const errors = Object.assign({}, response.body);

        if (errors.errors && errors.errors.length > 0) {
          delete errors.errors[0].href;
          delete errors.errors[0].details;
        }

        return errors;
      }

      return response.body;
    };

    const errors = getErrors(err.response);

    return {
      statusCode: 404,
      response: errors
    };
  },
  unhandleError: () => {
    return {
      statusCode: 500,
      response: {
        errors: [{
          status: 500,
          title: 'An unhandled error occurred'
        }]
      }
    };
  }
};

ResponseHandler.responseWithError = (reply) => (err) => {
  const handler = errorHandler[err.response.statusCode] || errorHandler.unhandleError;
  const handledErrors = handler(err);
  const response = reply(handledErrors.response);
  response.statusCode = handledErrors.statusCode;
  return response;
};

ResponseHandler.responseData = (reply, responseData) => reply({ data: responseData });

module.exports = ResponseHandler;
