import fastifyPlugin from 'fastify-plugin'
import fastifyMongo from '@fastify/mongodb'

async function dbConnector (fastify, options) {

    const config = fastify.config.dbConfig

    if (!isValidConfig(config)) {
        throw new Error('Invalid mongo configuration!')
    }

    // This is where you configure your mongo connection
    fastify.register(fastifyMongo, {
        url: `mongodb://${config.host}:${config.port}/${config.db}`
    })
}

function isValidConfig (config) {
    return config != null
        && config.host != null
        && config.port != null
        && config.db != null
}

export default fastifyPlugin(dbConnector)