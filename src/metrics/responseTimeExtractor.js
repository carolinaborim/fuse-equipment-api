const defaultInformation = {
  metricUnit: 'miliseconds',
  description: 'Response time in miliseconds',
  tags: ['response-time', 'equipment-facade']
};

class ResponseTimeExtractor {
  constructor(userInfoFetcher, userInfoTransformer, responseTimeTransformer) {
    this.userInfoFetcher = userInfoFetcher;
    this.userInfoTransformer = userInfoTransformer;
    this.responseTimeTransformer = responseTimeTransformer;
  }

  extract(request) {
    return this.userInfoFetcher.whoAmI(request.headers.authorization)
      .then((userInfo) => {
        const path = request.path;
        const method = request.method;
        const statusCode = request.response.statusCode;

        const transformedUserInfo = this.userInfoTransformer.transform(userInfo);
        const clientID = transformedUserInfo.clientID;
        const username = transformedUserInfo.username;

        const metric = this.responseTimeTransformer.transform(request.info);

        return Object.assign({
          path,
          method,
          statusCode,
          clientID,
          username,
          metric
        },
        defaultInformation);
      });
  }
}
module.exports = ResponseTimeExtractor;
