import fastify from 'fastify';
import autoload from '@fastify/autoload';
import {TypeBoxTypeProvider} from '@fastify/type-provider-typebox';
import {exit} from 'process';
import path from 'path';

const server = fastify().withTypeProvider<TypeBoxTypeProvider>();

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
