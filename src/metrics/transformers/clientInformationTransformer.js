class ClientInformationTransformer {
  transform(data) {
    const json = JSON.parse(data);

    return new Promise((resolve) => {
      const keys = Object.keys(json);
      const userType = keys[0];
      const userInformation = json[userType][0];
      const result = {
        clientID: userInformation.id,
        username: userInformation.emailAddress
      };

      resolve(result);
    });
  }
}

module.exports = ClientInformationTransformer;
