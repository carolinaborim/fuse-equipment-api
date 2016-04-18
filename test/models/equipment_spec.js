import EquipmentParser from '../../parser/equipmentParser.js';

describe('Equipment model', () => {
  it('should parse equipment with informations', () => {

    let telemetryEquipment = {
      id: 'a-equipment-id',
      description: 'a-equipment-description',
      serviceLevel: 'a-equipment-service-level',
      identificationNumber: 'a-equipment-identificationNumber',
      manufacturingDate: 'a-equipment-manufacturing-date',
      links: {
        dealer: 'fake-dealer-id',
        model: 'fake-model-id'
      }
    };

    let fetchedCanVariables = {
      trackingData: {
        ENGINE_HOURS: '100',
        ENGINE_SPEED: '100'
      },
      trackingPoint: {
        location: {
            coordinates: [
              0.9392138888888889,
              52.6362222,
              116
            ],
            type: 'Point'
        },
        status: 'WORKING'
      }
    };

    let expectedParsedEquipment = {
      type: 'equipment',
      id: 'a-equipment-id',
      attributes: {
        description: 'a-equipment-description',
        serviceLevel: 'a-equipment-service-level',
        identificationNumber: 'a-equipment-identificationNumber',
        manufacturingDate: 'a-equipment-manufacturing-date',
        trackingData: {
          ENGINE_HOURS: '100',
          ENGINE_SPEED: '100'
        },
        trackingPoint: {
          location: {
            coordinates: [
              0.9392138888888889,
              52.6362222,
              116
            ],
            type: 'Point'
          },
          status: 'WORKING'
        },
      },
      relationships: {
        dealer: {
          links: {
            self: '',
            related: ''
          },
          data: {
            type: 'dealer',
            id: 'fake-dealer-id'
          }
        },
        model: {
          links: {
            self: '',
            related: ''
          },
          data: {
            type: 'model',
            id: 'fake-model-id'
          }
        }
      }
    }

    let parsedEquipment = EquipmentParser.parse(telemetryEquipment, fetchedCanVariables);
    expect(parsedEquipment).to.be.eql(expectedParsedEquipment);
  });
});