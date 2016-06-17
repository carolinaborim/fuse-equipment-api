const appName = 'fuse-equipment-api';
const metricUnit = 'miliseconds';
const description = 'Response time in miliseconds';
const tags = ['response-time', 'equipment-facade'];

class ResponseTimeExtractor {
  constructor(clientInformationFetcher, clientInformationTransformer) {
    this.clientInformationFetcher = clientInformationFetcher;
    this.clientInformationTransformer = clientInformationTransformer;
  }

  extract(request) {
    return this.clientInformationFetcher.whoAmI(request.headers.authorization)
      .then(this.clientInformationTransformer.transform)
      .then((data) => {
        const path = request.path;
        const method = request.method;
        const statusCode = request.response.statusCode;

        const clientID = data.clientID;
        const username = data.username;

        const requestReceived = new Date(request.info.received);
        const requestResponded = new Date(request.info.responded);
        const metric = requestResponded - requestReceived;

        return {
          appName,
          path,
          method,
          statusCode,
          clientID,
          username,
          metric,
          metricUnit,
          description,
          tags
        };
      });
  }
}
module.exports = ResponseTimeExtractor;
