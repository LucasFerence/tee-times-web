// Plugins/routes for scheduling a tee time

async function schedule (fastify, options) {

    fastify.post('/schedule', async (request, reply) => {

        const body = request.body

        if (!isValid(body)) {

            reply.status(400)
            return 'bad request'
        }

        console.log(body)

        // Generate a unique taskId for the agenda
        const taskId = body.courseId + ';' + body.date

        const agenda = fastify.agenda

        agenda.define(taskId, async (job) => {

            console.log('Starting service for task: ' + taskId)

            // Run the task from an imported function from another file
        })

        agenda.every('*/2 * * * *', taskId)
    
        reply.send('ok')
    })
}

function isValid (body) {

    return body != null
        && !isEmpty(body.courseId)
        && !isEmpty(body.date)
        && !isEmpty(body.earliestTime)
        && !isEmpty(body.latestTime)
}

function isEmpty (str) {
    return (!str || str.length === 0 );
}

export default schedule