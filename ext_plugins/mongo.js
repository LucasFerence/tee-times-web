import fastifyPlugin from 'fastify-plugin'
import fastifyMongo from '@fastify/mongodb'

async function dbConnector (fastify, options) {

    // This is where you configure your mongo connection
    fastify.register(fastifyMongo, {
        url: 'mongodb://localhost:27017/test_database'
    })
}

export default fastifyPlugin(dbConnector)