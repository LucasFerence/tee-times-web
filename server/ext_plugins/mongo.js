import fastifyPlugin from 'fastify-plugin'
import fastifyMongo from '@fastify/mongodb'

async function dbConnector (fastify, options) {

    const config = fastify.config.dbConfig

    const fields = [
        fastify.field('host')
            .str()
            .required(),

        fastify.field('port')
            .str()
            .required(),

        fastify.field('db')
            .str()
            .required(),

        fastify.field('username')
            .str(),
        
        fastify.field('password')
            .str()
    ]

    const isValid = config != null && fastify.validateFields(config, fields)

    if (!isValid) {

        throw new Error('Invalid mongo configuration!')
    }

    // This is where you configure your mongo connection
    fastify.register(fastifyMongo, {
        url: `mongodb://${config.host}:${config.port}/${config.db}`
    })
}

export default fastifyPlugin(dbConnector)