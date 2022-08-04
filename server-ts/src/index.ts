import fastify, {FastifyInstance} from 'fastify';
import {exit} from 'process';

const server: FastifyInstance = fastify();

// Plugins
server.register(require('./plugins/ajv'));
server.register(require('./plugins/config'));
server.register(require('./plugins/mongo'));
server.register(require('./plugins/agenda'));

// Routes

// VMs
server.register(require('./routes/viewmodels/testvm'));

server.listen({port: 5050, host: '0.0.0.0'}, (err, address) => {
  if (err) {
    console.error(err);
    exit(1);
  }

  console.log(`Server listening at ${address}`);
});
