import fastifyPlugin from 'fastify-plugin'

import { Agenda } from 'agenda'

async function agenda (fastify, options) {

    // Configure the agenda with the mongo client
    const agenda = new Agenda(
        {
            mongo: fastify.mongo.client.db() 
        }
    )

    await agenda.start()

    fastify.decorate('agenda', agenda)
}

export default fastifyPlugin(agenda)
