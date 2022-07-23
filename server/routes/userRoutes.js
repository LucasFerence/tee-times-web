async function userService(fastify, options) {

    fastify.post('/registerUser', async (request, reply) => {

        const body = request.body

        const fields = [
            fastify.field('userId')
                .str()
                .required()
        ]

        const isValid = body != null && fastify.validateFields(body.user, fields)
        
        if (!isValid) {

            reply.status(400)
            return 'bad request'
        }

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

export default userService