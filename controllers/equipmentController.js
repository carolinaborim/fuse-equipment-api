import EquipmentParser from '../parser/equipmentParser';
import ResponseHandler from '../handlers/responseHandler';
import EquipmentFetcher from '../fetcher/equipmentFetcher';

const DEFAULT_OFFSET = 0;
const DEFAULT_LIMIT = 100;

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
  constructor(httpClient, telemetryAPI, canVariablesFetcher) {
    this.httpClient = httpClient;
    this.telemetryAPI = telemetryAPI;
    this.equipmentFetcher = new EquipmentFetcher(httpClient);
    this.canVariablesFetcher = canVariablesFetcher;
  }

  findAll(request, reply) {
    const offset = request.query.offset || DEFAULT_OFFSET;
    const limit = request.query.limit || DEFAULT_LIMIT;

    this.equipmentFetcher
      .findAll(
        offset,
        limit,
        request.headers.authorization
      )
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
    this.equipmentFetcher
      .findById(
        request.params.id,
        request.headers.authorization
      )
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
