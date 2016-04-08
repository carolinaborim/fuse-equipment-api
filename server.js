import Hapi from 'hapi';

const server = new Hapi.Server();
const PORT = process.env.PORT || 9090;
const BASE_URI = process.env.BASE_URI || 'localhost';

server.connection({
  host: BASE_URI,
  port: PORT
});

server.route({
  method: 'GET',
  path: '/equipment',
  handler: (request, reply) => {
    return reply('hello world');
  }
});

module.exports = server;
