
/**
 * Registers a new club. This will overwrite all club and course data for the club.
 * This is meant to be a complete definition of a club, not a partial update of only
 * club data or only course data
 * 
 * @param {*} fastify 
 * @param {*} options 
 */
async function registerClub(fastify, options) {

    fastify.post('/registerClub',  async (request, reply) => {
        
        // Store a club and courses. Make sure to refresh the plugin on fastify after something is added
        
        if (!isValidRequest(fastify, request.body)) {

            reply.status(400)
            return 'bad request'
        }

        const body = request.body
        const db = fastify.mongo.db

        upsertClub(db.collection('clubs'), body.club)

        reply.send('ok')
    })
}

async function upsertClub(collection, clubReq) {

    const filter = { clubId: clubReq.clubId }
    const options = { upsert: true }

    const courses = []

    for (const c of clubReq.courses) {

        // Build a course and add it in the list
        // This will completely override all courses
        courses.push(
            {
                courseId: c.courseId,
                courseName: c.courseName
            }
        )
    }

    const updateDoc = {
        $set: {
            clubName: clubReq.clubName,
            courses: courses
        }
    }

    const result = await collection.updateOne(filter, updateDoc, options)
    console.log(
      `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`
    )
}

function isValidRequest(fastify, body) {

    return body != null
        && validateClub(fastify, body.club)
        && validateCourses(fastify, body.club.courses)
}

function validateClub(fastify, club) {

    return club != null
        && !fastify.isStrEmpty(club.clubId)
        && !fastify.isStrEmpty(club.clubName)
}

function validateCourses(fastify, courses) {

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