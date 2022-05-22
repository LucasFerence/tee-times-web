// Plugins/routes for scheduling a tee time

async function schedule (fastify, options) {

    fastify.get('/schedule', async (request, reply) => {

        // This just adds a dummy response, this is useless but shows a little bit of what you can do
        const entries = fastify.mongo.db.collection('entries')
        entries.insertOne({ "a": 3 }, function (err, resp) {
            if (err) {
                reply.send(err)
                return
            }

            reply.send(resp)
        })
    })
}

export default schedule