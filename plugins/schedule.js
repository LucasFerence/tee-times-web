// Plugins/routes for scheduling a tee time

async function schedule (fastify, options) {

    fastify.get('/schedule', async (request, reply) => {

        const agenda = fastify.agenda

        agenda.define('abc', async (job) => {
            console.log('holy moly boly')
        })

        /**
         * Interesting note on scheduling:
         * the name is unique. So that means you can't schedule two jobs under the same name,
         * they will replace each other
         * 
         * That makes sense, but we'll need to make sure we can define a unique name for a job to be ran
         */
        agenda.every('*/2 * * * *', 'abc')

        reply.send('ok')
    })
}

export default schedule