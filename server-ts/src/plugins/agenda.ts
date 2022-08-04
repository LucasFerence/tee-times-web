import {FastifyInstance, FastifyPluginAsync} from 'fastify';
import fp from 'fastify-plugin';
import {Agenda} from 'agenda';

declare module 'fastify' {
  interface FastifyInstance {
    agenda: Agenda;
  }
}

const agenda: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // Configure the agenda with the mongo client
  const agenda = new Agenda({
    mongo: fastify.mongo.client.db(),
  });

  await agenda.start();

  fastify.decorate('agenda', agenda);
};

export default fp(agenda);
