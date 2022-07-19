import fastifyPlugin from 'fastify-plugin'

async function users(fastify, options) {

    fastify.decorate('getUser', getUser)
    fastify.decorate('isUserChronogolfSupported', isUserChronogolfSupported)
}

async function getUser(fastify, userId) {

    const db = fastify.mongo.db
    const collection = db.collection('users')

    const query = { userId: userId }

    return await collection.findOne(query)
}

async function isUserChronogolfSupported(fastify, userId) {

    const user = await getUser(fastify, userId)
    
    return user != null
        && !fastify.isStrEmpty(user.chronogolfUsername)
        && !fastify.isStrEmpty(user.chronogolfPassword)
}

export default fastifyPlugin(users)