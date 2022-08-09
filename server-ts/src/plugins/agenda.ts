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

  fastify.addHook('onClose', async fastify => {
    await fastify.agenda.close();
  });

  await refreshJobs(agenda);
};

async function refreshJobs(agenda: Agenda) {
  const jobs = await agenda.jobs({
    nextRunAt: {$ne: null},
  });
  jobs.map(async job => {
    const jobData = job.attrs;
    await agenda.define(jobData.name, (job, done) => {
      console.log('Fresh restarted job');
    });
  });
}

export default fp(agenda, {
  name: 'agenda',
  dependencies: ['mongo'],
});
