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
    (request, reply) => {
      console.log(request.body);
    }
  );
}

export default registerClub;
