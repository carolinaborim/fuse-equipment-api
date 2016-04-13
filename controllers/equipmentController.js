import Equipment from '../models/equipment';

const EquipmentController = (httpClient, telemetryAPI) => {
  EquipmentController.httpClient = httpClient;
  EquipmentController.telemetryAPI = telemetryAPI;
  EquipmentController.equipmentModel = new Equipment();
};

const errorHadler = {
  401: (err) => {
    return {
      errors: [
        {
          status: err.response.statusCode,
          title: err.response.body
        }
      ]
    };
  },
  404: (err) => {
    const errors = Object.assign({}, err.response.body);
    delete errors.errors[0].href;
    delete errors.errors[0].detail;
    return errors;
  },
  unhandleError: (err) => {
    err.response.statusCode = 500;
    return {
      errors: [
        {
          status: err.response.statusCode,
          title: 'An unhandle error happened'
        }
      ]
    };
  }
};

const responseWithError = (request, reply) => (err) => {
  const handler = errorHadler[err.response.statusCode] || errorHadler.unhandleError;
  const errors = handler(err);
  const response = reply(errors);
  response.statusCode = err.response.statusCode;
  return response;
};

const responseWithSingleEquipment = (request, reply) => (equipments) => {
  const parsedEquipment = EquipmentController.equipmentModel.parseEquipment(
    equipments.equipment[0]
  );
  return reply({
    data: parsedEquipment
  });
};

const responseWithEquipments = (request, reply) => (equipments) => {
  const equipmentData = equipments.equipment.map(
    EquipmentController.equipmentModel.parseEquipment
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
