import fastifyPlugin from 'fastify-plugin'
import nodeConfig from 'config'

async function config (fastify, options) {

    fastify.decorate('config', nodeConfig.get('Root'))
}

export default fastifyPlugin(config)