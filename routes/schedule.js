// Plugins/routes for scheduling a tee time

async function schedule (fastify, options) {

    fastify.post('/schedule', async (request, reply) => {

        const body = request.body

        if (!fastify.validateBookReq(fastify, body)) {

            reply.status(400)
            return 'bad request'
        }

        // Generate a unique taskId for the agenda
        const taskId = body.courseId + ';' + body.date

        // If requested to be instant, just run it
        // Probably not a bad idea to remove/put behind high auth to do this
        if (body.isInstant) {
            
            console.log('Instantly starting service: ' + taskId)
            fastify.book(request.body)

            return 'ok'
        }

        const agenda = fastify.agenda

        agenda.define(taskId, async (job) => {

            console.log('Starting service for task: ' + taskId)
            fastify.book(request.body)
        })

        agenda.every('*/2 * * * *', taskId)
    
        reply.send('ok')
    })
}

export default schedule