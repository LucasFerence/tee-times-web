import fastify, {FastifyInstance} from 'fastify';
import autoload from '@fastify/autoload';
import {exit} from 'process';
import path from 'path';

const server: FastifyInstance = fastify();

// Plugins
server.register(autoload, {
  dir: path.join(__dirname, 'plugins'),
});

// Routes
server.register(autoload, {
  dir: path.join(__dirname, 'routes'),
  dirNameRoutePrefix: false,
});

server.listen({port: 5050, host: '0.0.0.0'}, (err, address) => {
  if (err) {
    console.error(err);
    exit(1);
  }

  console.log(`Server listening at ${address}`);
});
