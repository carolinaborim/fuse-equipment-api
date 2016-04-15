import CanVariablesFetcher from '../fetcher/canVariablesFetcher';
import EquipmentParser from '../parser/equipmentParser';
import ResponseHandler from '../handlers/responseHandler';

const parseEquipments = (equipments, equipmentsInformations) => {
  return equipments.equipment.map((data) => {
    return EquipmentParser.parse(data, equipmentsInformations[data.id]);
  });
};

const responseWithSingleEquipment = (reply) => (equipments, equipmentsInformations) => {
  const parsedEquipment = parseEquipments(equipments, equipmentsInformations)[0];
  return ResponseHandler.responseData(reply, parsedEquipment);
};

const responseWithEquipments = (reply) => (equipments, equipmentsInformations) => {
  const parsedEquipments = parseEquipments(equipments, equipmentsInformations);
  return ResponseHandler.responseData(reply, parsedEquipments);
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
    .spread(responseWithEquipments(reply))
    .catch(ResponseHandler.responseWithError(reply));
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
    .spread(responseWithSingleEquipment(reply))
    .catch(ResponseHandler.responseWithError(reply));
  }
}

module.exports = EquipmentController;
