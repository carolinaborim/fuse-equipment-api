class UserInfoTransformer {
  transform(data) {
    const json = JSON.parse(data);

    const keys = Object.keys(json);
    const userType = keys[0];
    const userInformation = json[userType][0];

    return {
      clientID: userInformation.id,
      username: userInformation.emailAddress
    };
  }
}

module.exports = UserInfoTransformer;
