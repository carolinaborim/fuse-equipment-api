const appName = 'fuse-equipment-api';
const metricUnit = 'miliseconds';
const description = 'Response time in miliseconds';
const tags = ['response-time', 'equipment-facade'];

class ApiResponseTimeExtractor {
  constructor(clientInformationFetcher) {
    this.clientInformationFetcher = clientInformationFetcher;
  }

  extract(request) {
    const path = request.path;
    const method = request.method;
    const statusCode = request.response.statusCode;

    const clientInformation = this.clientInformationFetcher.whoAmI(request.headers.authorization);
    const clientID = clientInformation.clientID;
    const username = clientInformation.username;

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
  }
}
module.exports = ApiResponseTimeExtractor;
