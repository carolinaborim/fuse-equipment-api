import Hapi from 'hapi';

const server = new Hapi.Server();
const PORT = process.env.PORT || 9090;

server.connection({ 
    host: 'localhost', 
    port: PORT 
});

server.route({
    method: 'GET',
    path:'/equipment', 
    handler: function (request, reply) {
        return reply('hello world');
    }
});

server.start((err) => {
    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});
