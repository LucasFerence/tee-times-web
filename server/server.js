import Fastify from 'fastify'

import config from './ext_plugins/config.js'
import dbConnector from './ext_plugins/mongo.js'
import agenda from './ext_plugins/agenda.js'

import validate from './plugins/validate.js'

import users from './plugins/users.js'
import clubs from './plugins/clubs.js'
import teeTimes from './plugins/tee-times.js'
import bookTime from './plugins/book.js'

import schedule from './routes/schedule.js'
import userService from './routes/userRoutes.js'
import clubService from './routes/clubRoutes.js'

const fastify = Fastify({
  logger: true
})

fastify.register(validate)

// External plugins
fastify.register(config)
fastify.register(dbConnector)
fastify.register(agenda)

// Internal plugins
fastify.register(users)
fastify.register(clubs)
fastify.register(teeTimes)
fastify.register(bookTime)

// Routes
fastify.register(schedule)
fastify.register(userService)
fastify.register(clubService)

// Run the server!
fastify.listen(5050, '0.0.0.0', function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})