import requestPromise from 'request-promise';
import helper from './contract_helper';

const contractHttpRequest = (request, cb) => {
  const contractRequest = request;
  helper.requestOAuthAccessToken()
  .then((accessToken) => {
    contractRequest.headers = {
      authorization: accessToken
    };
    return requestPromise(contractRequest);
  })
  .then((response) => {
    const consumerContractResponse = {
      method: request.method,
      href: request.url,
      body: response,
      statusCode: 201,
      request
    };
    cb(null, consumerContractResponse);
  })
  .catch((err) => {
    console.log(err);
    cb(err);
  });
};

contractHttpRequest.defaults = () => {
  return contractHttpRequest;
};

module.exports = contractHttpRequest;
