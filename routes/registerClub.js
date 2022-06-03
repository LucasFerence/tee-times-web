
async function registerClub (fastify, options) {

    fastify.post('/registerClub',  async (request, reply) => {
        
        // Store a club and courses. Make sure to refresh the plugin on fastify after something is added
        
        if (!isValidRequest(fastify, request.body)) {

            console.log(request.body.club)

            reply.status(400)
            return 'bad request'
        }

        const body = request.body
        const db = fastify.mongo.db

        upsertClub(db.collection('clubs'), body.club)

        reply.send('ok')
    })
}

async function upsertClub (collection, clubReq) {

    const filter = { clubId: clubReq.clubId }
    const options = { upsert: true }

    const updateDoc = {
        $set: {
            clubName: clubReq.clubName,
            courses: []
        }
    }

    const result = await collection.updateOne(filter, updateDoc, options)
    console.log(
      `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
    )
}

function isValidRequest (fastify, body) {

    return body != null
        && validateClub(fastify, body.club)
        && validateCourses(fastify, body.club.courses)
}

function validateClub (fastify, club) {

    return club != null
        && !fastify.isStrEmpty(club.clubId)
        && !fastify.isStrEmpty(club.clubName)
}

function validateCourses (fastify, courses) {

    if (courses == null) {
        return false
    }

    for (const c of courses) {
        
        const isValidCourse = !fastify.isStrEmpty(c.courseId)
            && !fastify.isStrEmpty(c.courseName)

        if (!isValidCourse) {
            return false
        }
    }

    return true
}

export default registerClub