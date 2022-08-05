import {FastifyInstance} from 'fastify';
import {Club, ClubType} from 'src/schema/chronogolf/club';

async function registerClub(server: FastifyInstance) {
  server.post<{Body: ClubType}>(
    '/registerClub',
    {
      schema: {
        body: Club,
      },
    },
    async (request, reply) => {
      const club: ClubType = request.body;
      const collection = server.mongo.db?.collection('clubs');

      // Look for one that already exists
      const filter = {id: club.id};

      // Mark as upsert so we either update or insert one
      const options = {upsert: true};

      const updateDoc = {
        $set: {
          name: club.name,
          scheduleOffsetDays: club.scheduleOffsetDays,
          scheduleOffsetHours: club.scheduleOffsetHours,
          courses: club.courses,
        },
      };

      // Insert club into database
      await collection?.updateOne(filter, updateDoc, options);

      reply.status(200);
    }
  );
}

export default registerClub;
