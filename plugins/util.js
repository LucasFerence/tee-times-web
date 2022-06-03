import fastifyPlugin from 'fastify-plugin'

// General utilities
async function util (fastify, options) {

    fastify.decorate('isStrEmpty', isStrEmpty)
}

function isStrEmpty (str) {
    return (!str || str.length === 0 );
}

export default fastifyPlugin(util)