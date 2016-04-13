import Equipment from '../models/equipment';

const EquipmentController = (httpClient, telemetryAPI) => {
  EquipmentController.httpClient = httpClient;
  EquipmentController.telemetryAPI = telemetryAPI;
  EquipmentController.equipmentModel = new Equipment();
};

const responseWithError = (request, reply) => (err) => {
  let errors = {};
  if (err.response.statusCode === 401) {
    errors = {
      errors: [
        {
          status: err.response.statusCode,
          title: err.response.body
        }
      ]
    };
  } else if (err.response.statusCode === 404) {
    Object.assign(errors, err.response.body);
    delete errors.errors[0].href;
    delete errors.errors[0].detail;
  }
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
