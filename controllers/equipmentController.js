const responseWithError = (request, reply) => (err) => {
  const response = reply({
    errors: [
      {
        status: err.response.statusCode,
        title: err.response.body
      }
    ]
  });
  response.statusCode = err.response.statusCode;
  return response;
};

const parseEquipment = (equipment) => {
  return {
    type: 'equipment',
    id: equipment.id,
    attributes: {
      description: equipment.description,
      serviceLevel: equipment.serviceLevel,
      identificationNumber: equipment.identificationNumber,
      manufacturingDate: equipment.manufacturingDate
    },
    relationships: {
      dealer: {
        links: {
          self: '',
          related: ''
        },
        data: {
          type: 'dealer',
          id: equipment.links.dealer
        }
      },
      model: {
        links: {
          self: '',
          related: ''
        },
        data: {
          type: 'model',
          id: equipment.links.model
        }
      }
    }
  };
};

const responseWithSingleEquipment = (request, reply) => (equipments) => {
  const parsedEquipment = parseEquipment(equipments.equipment[0]);
  return reply({
    data: parsedEquipment
  });
};

const responseWithEquipments = (request, reply) => (equipments) => {
  const equipmentData = equipments.equipment.map((equipment) => {
    return parseEquipment(equipment);
  });

  return reply({
    data: equipmentData
  });
};

const EquipmentController = (httpClient, telemetryAPI) => {
  EquipmentController.httpClient = httpClient;
  EquipmentController.telemetryAPI = telemetryAPI;
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
