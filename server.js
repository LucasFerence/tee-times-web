import Fastify from 'fastify'
import schedule from './plugins/schedule.js'

const fastify = Fastify({
  logger: true
})

fastify.register(schedule)

// Run the server!
fastify.listen(3000, '0.0.0.0', function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  // Server is now listening on ${address}
})