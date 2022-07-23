
/**
 * Registers a new club. This will overwrite all club and course data for the club.
 * This is meant to be a complete definition of a club, not a partial update of only
 * club data or only course data
 * 
 * @param {*} fastify 
 * @param {*} options 
 */
async function clubRoutes(fastify, options) {

    fastify.get('/clubs', async (request, reply) => {

        const db = fastify.mongo.db
        const collection = db.collection('clubs')

        // Only include the fields we want
        const options = {
            projection: {
                _id: 0,
                clubId: 1,
                clubName: 1
            }
        }

        // No query
        const clubs = await collection.find({}, options).toArray()

        reply.send(clubs)
    })

    fastify.get('/courses/:clubId', async (request, reply) => {

        const db = fastify.mongo.db
        const collection = db.collection('clubs')

        const options = {
            projection: {
                _id: 0,
                clubId: 1,
                clubName: 1,
                courses: 1
            }
        }

        const { clubId } = request.params

        console.log(`Querying for clubId: ${clubId}`)

        const query = {
            clubId: clubId
        }

        const club = await collection.findOne(query, options)

        if (!club) {
            reply.send({})
        } else {
            reply.send(club)
        }
    })

    fastify.post('/registerClub',  async (request, reply) => {
        const body = request.body

        const isValid = body != null && fastify.validateFields(
            body.club,
            [
                fastify.field('clubId')
                    .str()
                    .required(),
    
                fastify.field('clubName')
                    .str()
                    .required(),
    
                fastify.field('courses')
                    .list()
                    .obj([
                        fastify.field('courseId')
                            .str()
                            .required(),
    
                        fastify.field('courseName')
                            .str()
                            .required()
                    ])
                    .required()
            ]
        )
        
        if (!isValid) {
            reply.status(400)
            return 'bad request'
        }

        upsertClub(fastify.mongo.db.collection('clubs'), body.club)

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

export default clubRoutes