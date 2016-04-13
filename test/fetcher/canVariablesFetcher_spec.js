import CanVariablesFetcher from '../../fetcher/canVariablesFetcher.js';

describe('CanVariablesFetcher', () => {
  it('fetches can variables data by equipment id', (done) => {
      let expectedResponse = { 
        'engine_hours': '123123123',
        'engine_speed': '123123123123',
        'driving_direction': '12321312'
      }

      let canVariablesFetcher = new CanVariablesFetcher();
      canVariablesFetcher.fetchByEquipmentId('id')
        .then((reponse) => {
          expect(response).to.be.eql(expectedResponse);
          done();
        });
  });
});
