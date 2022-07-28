import { DateTime } from "luxon"
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
                .isoDate()
                .required(),

            fastify.field('amtPlayers')
                .num()
                .required()
                .validate(f => f != 0),

            fastify.field('earliestTime')
                .isoDate()
                .required(),

            fastify.field('latestTime')
                .isoDate()
                .required(),

            // Optional fields

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

        const config = fastify.config.chronogolf
        const isValidConfig = config != null && fastify.validateFields(
            config,
            [
                fastify.field('scheduleDayOffset')
                    .num()
                    .required(),

                fastify.field('scheduleTimeOffset')
                    .num()
                    .required()
            ]
        )

        if (!isValidConfig) {

            reply.status(500)
            return 'internal error'
        }

        return await doSchedule(fastify, reply, body, config)
    })
}

async function doSchedule(fastify, reply, body, config) {

    // Generate a unique taskId for the agenda
    const taskId = `${body.userId};${body.courseId};${body.date}`
    const agenda = fastify.agenda

    const jobs = await agenda.jobs(
        {name: taskId, nextRunAt: {$exists:true}}
    )

    // Check to see if the job already exists, if it does do not create a new one
    if (jobs != null && jobs.length !== 0) {
        console.error(`Job already exists: ${taskId}`)
        reply.status(400)
        return 'bad request'
    }

    agenda.define(taskId, async (job) => {

        console.log('Starting service for task: ' + taskId)
        fastify.book(fastify, body)
    })

    const now = DateTime.now()
    const teeTimeDate = DateTime.fromISO(body.date)

    const scheduleDate = teeTimeDate.minus({
        days: config.scheduleDayOffset,
        hours: config.scheduleTimeOffset
    })

    if (scheduleDate > now) {

        console.log(`Scheduling job: ${taskId}`)
        agenda.schedule(scheduleDate.toJSDate(), taskId)
    } else {

        console.log(`Executing job immediately: ${taskId}`)
        agenda.now(taskId)
    }

    return 'ok'
}

export default schedule