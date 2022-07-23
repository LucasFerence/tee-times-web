import fastifyPlugin from 'fastify-plugin'

// Register enums for supported clubs and courses within them
async function clubs(fastify, options) {

    fastify.decorate('chronogolfClub', createChronogolfClub)
}

function createChronogolfClub(id) {
    return new ChronogolfClub(id)
}

class ChronogolfClub {

    constructor(id) {
        this.id = id
    }

    // -- Utility --

    async isSupported(fastify, courseId) {
        // See if the club is supported

        const db = fastify.mongo.db
        const collection = db.collection('clubs')

        const query = {
            clubId: this.id,
            'courses.courseId': courseId
        }

        const count = await collection.countDocuments(query)

        return count > 0
    }
}

export default fastifyPlugin(clubs)