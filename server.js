import Fastify from 'fastify'

import dbConnector from './ext_plugins/mongo.js'
import agenda from './ext_plugins/agenda.js'

import schedule from './plugins/schedule.js'
import bookTime from './plugins/book.js'

const fastify = Fastify({
  logger: true
})

// Plugins
fastify.register(dbConnector)
fastify.register(agenda)
fastify.register(bookTime)

// Routes
fastify.register(schedule)

// Run the server!
fastify.listen(3000, '0.0.0.0', function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  // Server is now listening on ${address}
})