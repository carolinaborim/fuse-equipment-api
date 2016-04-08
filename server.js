import Hapi from 'hapi';

const server = new Hapi.Server();
const PORT = process.env.PORT || 9090;

server.connection({
  host: '0.0.0.0',
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
