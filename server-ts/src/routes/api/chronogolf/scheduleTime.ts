import {FastifyInstance} from 'fastify';
import {Static, Type} from '@sinclair/typebox';

const RequestType = Type.Object({
  userId: Type.String(),
  clubId: Type.String(),
  courseId: Type.String(),
  date: Type.String({format: 'date-time'}),
  playerCount: Type.Integer({minimum: 1, maximum: 4}),
  earliestTime: Type.String({format: 'date-time'}),
  latestTime: Type.String({format: 'date-time'}),
  checkout: Type.Optional(Type.Boolean()),
});

type Request = Static<typeof RequestType>;

const ResponseType = Type.Object({
  executionTime: Type.String({format: 'date-time'}),
});

type Response = Static<typeof ResponseType>;

export default async function scheduleTime(server: FastifyInstance) {
  server.post<{Body: Request; Reply: Response}>(
    '/scheduleChronogolf',
    {
      schema: {
        body: RequestType,
        response: {
          200: ResponseType,
        },
      },
    },
    async (request, reply) => {
      const scheduleDetails: Request = request.body;
      const user = await server.getChronogolfUser(scheduleDetails.userId);

      console.log(user);
    }
  );
}
