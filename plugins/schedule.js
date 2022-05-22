// Plugins/routes for scheduling a tee time

async function schedule (fastify, options) {

    fastify.get('/schedule', async (request, reply) => {
        return { status: 'success' }
    })
}

export default schedule