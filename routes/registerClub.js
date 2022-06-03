
async function registerClub (fastify, options) {

    fastify.post('/registerClub',  async (request, reply) => {
        
        // Store a club and courses. Make sure to refresh the plugin on fastify after something is added
        
        if (!isValidRequest(fastify, request.body)) {

            reply.status(400)
            return 'bad request'
        }

        const body = request.body
        const clubsCollection = fastify.mongo.db.collection('clubs')

        const doc = {
            "clubId": body.clubId
        }

        const result = await clubsCollection.insertOne(doc)

        console.log(result)

        reply.send('ok')
    })
}

function isValidRequest (fastify, body) {

    return body != null
        && !fastify.isStrEmpty(body.clubId)
        && body.courses != null
}

export default registerClub