class ResponseTimeTransformer {
  transform(requestInfo) {
    const requestReceived = new Date(requestInfo.received);
    const requestResponded = new Date(requestInfo.responded);
    return requestResponded - requestReceived;
  }
}

module.exports = ResponseTimeTransformer;
