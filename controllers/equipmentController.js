import EquipmentParser from '../parser/equipmentParser';
import ResponseHandler from '../handlers/responseHandler';

const DEFAULT_OFFSET = 0;
const DEFAULT_LIMIT = 100;

const parseEquipment = (equipment, trackingData, trackingPoint) => {
  return equipment.equipment.map((data) => {
    return EquipmentParser.parse(
      data,
      trackingData[data.id],
      trackingPoint[data.id]
    );
  });
};

const responseWithSingleEquipment = (reply) => (equipment, trackingData, trackingPoint) => {
  const parsedEquipment = parseEquipment(equipment, trackingData, trackingPoint)[0];
  return ResponseHandler.responseData(reply, parsedEquipment);
};

const responseWithEquipment = (reply) => (equipment, trackingData, trackingPoint) => {
  const parsedEquipment = parseEquipment(equipment, trackingData, trackingPoint);
  return ResponseHandler.responseData(reply, parsedEquipment);
};

class EquipmentController {
  constructor(equipmentFetcher, canVariablesFetcher, trackingPointFetcher) {
    this.equipmentFetcher = equipmentFetcher;
    this.canVariablesFetcher = canVariablesFetcher;
    this.trackingPointFetcher = trackingPointFetcher;
  }

  findAll(request, reply) {
    const offset = parseInt(request.query.offset, 10) || DEFAULT_OFFSET;
    const limit = parseInt(request.query.limit, 10) || DEFAULT_LIMIT;

    this.enrich(
      this.equipmentFetcher.findAll(
        offset,
        limit,
        request.headers.authorization
      ),
      request.headers.authorization
    )
    .spread(responseWithEquipment(reply))
    .catch(ResponseHandler.responseWithError(reply));
  }

  findById(request, reply) {
    this.enrich(
      this.equipmentFetcher.findById(
        request.params.id,
        request.headers.authorization
      ),
      request.headers.authorization
    )
    .spread(responseWithSingleEquipment(reply))
    .catch(ResponseHandler.responseWithError(reply));
  }

  enrich(equipmentPromise, authorizationBearer) {
    const information = [];
    let equipmentIds = null;

    return equipmentPromise
      .then((equipment) => {
        equipmentIds = equipment.equipment.map((equipment) => equipment.id);
        information.push(equipment);
      })
      .then(() => {
        return this.canVariablesFetcher.fetchByEquipmentId(
          equipmentIds,
          authorizationBearer
        );
      })
      .then((trackingData) => information.push(trackingData))
      .then(() => {
        return this.trackingPointFetcher.fetchByEquipmentId(
          equipmentIds,
          authorizationBearer
        );
      })
      .then((trackingPoint) => information.push(trackingPoint))
      .then(() => information);
  }
}

module.exports = EquipmentController;
