import fastifyPlugin from 'fastify-plugin'

// Register enums for supported clubs and courses within them
async function clubs (fastify, options) {

    fastify.decorate('isClubSupported', isSupported)
}

async function isSupported (fastify, club, course) {

    // See if the club is supported

    const db = fastify.mongo.db
    const collection = db.collection('clubs')

    const query = { 
        clubId: club,
        'courses.courseId': course
    }

    const count = await collection.countDocuments(query)

    return count > 0
}

export default fastifyPlugin(clubs)