import CanVariablesFetcher from '../fetcher/canVariablesFetcher';
import Equipment from '../models/equipment';
import ReponseHandler from '../handlers/responseHandler';

const responseWithSingleEquipment = (request, reply) => (equipments, equipmentInformations) => {
  const parsedEquipment = Equipment.parseEquipment(
    equipments.equipment[0],
    equipmentInformations[equipments.equipment[0].id]
    );
  return reply({
    data: parsedEquipment
  });
};

const responseWithEquipments = (request, reply) => (equipments, equipmentsInformations) => {
  const equipmentData = equipments.equipment.map((data) => {
    return Equipment.parseEquipment(data, equipmentsInformations[data.id]);
  }
  );

  return reply({
    data: equipmentData
  });
};

class EquipmentController {
  constructor(httpClient, telemetryAPI) {
    this.httpClient = httpClient;
    this.telemetryAPI = telemetryAPI;
    this.canVariablesFetcher = new CanVariablesFetcher(httpClient);
  }

  findAll(request, reply) {
    return this.httpClient({
      method: 'GET',
      json: true,
      url: `${this.telemetryAPI}/equipment`,
      headers: {
        Authorization: request.headers.authorization
      }
    })
    .then((equipments) => {
      const equipmentIds = equipments.equipment.map((equipment) => equipment.id);
      return this.canVariablesFetcher.fetchByEquipmentId(
        equipmentIds,
        request.headers.authorization
        )
      .then((canVariables) => {
        return [equipments, canVariables];
      });
    })
    .spread(responseWithEquipments(request, reply))
    .catch(ReponseHandler.responseWithError(request, reply));
  }

  findById(request, reply) {
    return this.httpClient({
      method: 'GET',
      json: true,
      url: `${this.telemetryAPI}/equipment/${request.params.id}`,
      headers: {
        Authorization: request.headers.authorization
      }
    })
    .then((equipments) => {
      return this.canVariablesFetcher.fetchByEquipmentId(
        [equipments.equipment[0].id],
        request.headers.authorization
        )
      .then((canVariables) => {
        return [equipments, canVariables];
      });
    })
    .spread(responseWithSingleEquipment(request, reply))
    .catch(ReponseHandler.responseWithError(request, reply));
  }
}

module.exports = EquipmentController;
