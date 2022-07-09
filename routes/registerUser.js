async function registerUser(fastify, options) {

    fastify.post('/registerUser', async (request, reply) => {
        
        if (!isValidRequest(fastify, request.body)) {

            reply.status(400)
            return 'bad request'
        }

        const body = request.body
        const db = fastify.mongo.db

        upsertUser(fastify, db.collection('users'), body.user)

        reply.send('ok')
    })
}

async function upsertUser(fastify, collection, userReq) {

    const filter = { userId: userReq.userId }
    const options = { upsert: true }

    var updateMap = {}
    
    if (!fastify.isStrEmpty(userReq.chronogolfUsername)) {
        updateMap['chronogolfUsername'] = userReq.chronogolfUsername
    }

    if (!fastify.isStrEmpty(userReq.chronogolfPassword)) {
        updateMap['chronogolfPassword'] = userReq.chronogolfPassword
    }

    const updateDoc = {
        $set: updateMap
    }

    const result = await collection.updateOne(filter, updateDoc, options)
    console.log(
        `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`
    )
}

function isValidRequest(fastify, body) {

    return body != null
        && body.user != null
        && !fastify.isStrEmpty(body.user.userId)
}

export default registerUser