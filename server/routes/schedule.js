// Plugins/routes for scheduling a tee time

async function schedule (fastify, options) {

    fastify.post('/schedule', async (request, reply) => {

        const body = request.body

        const fields = [
            fastify.field('userId')
                .str()
                .required(),
            
            fastify.field('clubId')
                .str()
                .required(),

            fastify.field('courseId')
                .str()
                .required(),

            fastify.field('date')
                .str()
                .required(),

            fastify.field('amtPlayers')
                .num()
                .required()
                .validate(f => f != 0),

            fastify.field('earliestTime')
                .str()
                .required(),

            fastify.field('latestTime')
                .str()
                .required(),

            // Optional fields

            fastify.field('isInstant')
                .bool(),

            fastify.field('isHeadless')
                .bool(),

            fastify.field('checkout')
                .bool()
        ]

        const isValid = body != null && fastify.validateFields(body, fields)

        // Check to make sure the body has the correct parameters
        if (!isValid) {

            reply.status(400)
            return 'bad request'
        }

        const isSupportedUser = await fastify.isUserChronogolfSupported(fastify, body.userId)
        if (!isSupportedUser) {

            reply.status(400)
            return 'unsupported user'
        }

        // Make sure the club is supported
        const isSupportedClub = await fastify.chronogolfClub(body.clubId).isSupported(fastify, body.courseId)
        if (!isSupportedClub) {

            reply.status(400)
            return 'unsupported club'
        }

        // Generate a unique taskId for the agenda
        const taskId = body.courseId + ';' + body.date

        // If requested to be instant, just run it
        // Probably not a bad idea to remove/put behind high auth to do this
        if (body.isInstant) {
            
            console.log('Instantly starting service: ' + taskId)
            fastify.book(fastify, request.body)

            return 'ok'
        }

        const agenda = fastify.agenda

        agenda.define(taskId, async (job) => {

            console.log('Starting service for task: ' + taskId)
            fastify.book(fastify, request.body)
        })

        agenda.every('*/2 * * * *', taskId)
    
        reply.send('ok')
    })
}

export default schedule