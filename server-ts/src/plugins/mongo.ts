import {FastifyInstance, FastifyPluginAsync} from 'fastify';
import fp from 'fastify-plugin';
import fastifyMongo from '@fastify/mongodb';
import {Static, Type} from '@sinclair/typebox';

const dbConnector: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // Define the type that we expect from config
  const assertion = Type.Object({
    host: Type.String(),
    port: Type.Integer(),
    db: Type.String(),
    username: Type.String(),
    password: Type.String(),
  });

  // Assign it a type
  type Assertion = Static<typeof assertion>;

  // Retrive it from the config
  const dbConfig: Assertion = fastify.config.get('db');

  // Use internal ajv plugin to validate
  if (!fastify.ajv.validate(assertion, dbConfig)) {
    throw new Error('Invalid mongo configuration!');
  }

  fastify.register(fastifyMongo, {
    url: `mongodb://${dbConfig.host}:${dbConfig.port}/${dbConfig.db}`,
  });
};

export default fp(dbConnector, {
  name: 'mongo',
  dependencies: ['ajv', 'config'],
});
