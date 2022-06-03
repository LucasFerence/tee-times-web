import Fastify from 'fastify'

import config from './ext_plugins/config.js'
import dbConnector from './ext_plugins/mongo.js'
import agenda from './ext_plugins/agenda.js'

import util from './plugins/util.js'

import clubs from './plugins/clubs.js'
import teeTimes from './plugins/tee-times.js'
import bookTime from './plugins/book.js'

import schedule from './routes/schedule.js'
import registerClub from './routes/registerClub.js'

const fastify = Fastify({
  logger: true
})

fastify.register(util)

// External plugins
fastify.register(config)
fastify.register(dbConnector)
fastify.register(agenda)

// Internal plugins
fastify.register(clubs)
fastify.register(teeTimes)
fastify.register(bookTime)

// Routes
fastify.register(schedule)
fastify.register(registerClub)

// Run the server!
fastify.listen(3000, '0.0.0.0', function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  // Server is now listening on ${address}
})