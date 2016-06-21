import UserInfoTransformer from '../../../../src/metrics/transformers/userInfo';

describe('User information transformer', () => {
  const expectedResult = '{ \
    "serviceUsers": [{ \
      "id": "fake-id", \
      "emailAddress": "user@example.com", \
      "status": "active", \
      "links": { \
        "roles": ["fake-role"] \
      } \
    }] \
    }';

  it('should transform IAM response into a client ID', (done) => {
    const userInfoTransformer = new UserInfoTransformer();
    const data = userInfoTransformer.transform(expectedResult);
    expect(data.clientID).to.be.eql('fake-id');
    done();
  });

  it('should transform IAM response into an username', (done) => {
    const userInfoTransformer = new UserInfoTransformer();
    const data = userInfoTransformer.transform(expectedResult);
    expect(data.username).to.be.eql('user@example.com');
    done();
  });
});
