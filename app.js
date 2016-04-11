import Hapi from 'hapi';

const server = new Hapi.Server();
const PORT = process.env.PORT || 9090;

const app = (httpClient, telemetryAPI) => {
  server.connection({
    host: '0.0.0.0',
    port: PORT
  });

  server.route({
    method: 'GET',
    path: '/equipment',
    handler: (request, reply) => {
      return httpClient({
        method: 'GET',
        json: true,
        url: `${telemetryAPI}/equipment`,
        headers: {
            'Authorization': request.headers.authorization
        }
      })
      .then((response) => {
        console.log(response);
        return reply({
          data: []
        });
      })
      .catch((err) => {
        console.log(err);
        return reply({
          error: err
        });
      });
    }
  });

  return server;
};

module.exports = app;
