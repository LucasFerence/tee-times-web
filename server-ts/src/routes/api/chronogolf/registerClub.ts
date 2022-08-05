import {FastifyInstance} from 'fastify';
import {Club, ClubType} from 'src/schema/chronogolf/club';

export default async function registerClub(server: FastifyInstance) {
  server.post<{Body: Club}>(
    '/registerChronogolfClub',
    {
      schema: {
        body: ClubType,
      },
    },
    async (request, reply) => {
      const club: Club = request.body;
      const collection = server.mongo.db?.collection('chronogolfClubs');

      const filter = {id: club.id};
      const options = {upsert: true};

      const updateDoc = {
        $set: {
          name: club.name,
          scheduleOffsetDays: club.scheduleOffsetDays,
          scheduleOffsetHours: club.scheduleOffsetHours,
          courses: club.courses,
        },
      };

      await collection?.updateOne(filter, updateDoc, options);

      reply.status(200);
    }
  );
}
