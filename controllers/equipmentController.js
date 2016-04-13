import Equipment from '../models/equipment';

const EquipmentController = (httpClient, telemetryAPI) => {
  EquipmentController.httpClient = httpClient;
  EquipmentController.telemetryAPI = telemetryAPI;
};

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
    const errors = Object.assign({}, err.response.body);
    delete errors.errors[0].href;
    delete errors.errors[0].detail;
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
          title: 'An unhandle error happened'
        }]
      }
    };
  }
};

const responseWithError = (request, reply) => (err) => {
  const handler = errorHandler[err.response.statusCode] || errorHandler.unhandleError;
  const handledErrors = handler(err);
  const response = reply(handledErrors.response);
  response.statusCode = handledErrors.statusCode;
  return response;
};

const responseWithSingleEquipment = (request, reply) => (equipments) => {
  const parsedEquipment = Equipment.parseEquipment(
    equipments.equipment[0]
  );
  return reply({
    data: parsedEquipment
  });
};

const responseWithEquipments = (request, reply) => (equipments) => {
  const equipmentData = equipments.equipment.map(
    Equipment.parseEquipment
  );

  return reply({
    data: equipmentData
  });
};

EquipmentController.prototype.findAll = (request, reply) => {
  return EquipmentController.httpClient({
    method: 'GET',
    json: true,
    url: `${EquipmentController.telemetryAPI}/equipment`,
    headers: {
      Authorization: request.headers.authorization
    }
  })
  .then(responseWithEquipments(request, reply))
  .catch(responseWithError(request, reply));
};

EquipmentController.prototype.findById = (request, reply) => {
  return EquipmentController.httpClient({
    method: 'GET',
    json: true,
    url: `${EquipmentController.telemetryAPI}/equipment/${request.params.id}`,
    headers: {
      Authorization: request.headers.authorization
    }
  })
  .then(responseWithSingleEquipment(request, reply))
  .catch(responseWithError(request, reply));
};

module.exports = EquipmentController;
