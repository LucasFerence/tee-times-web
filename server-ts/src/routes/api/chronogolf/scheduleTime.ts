import {FastifyInstance} from 'fastify';
import {Static, Type} from '@sinclair/typebox';

const Request = Type.Object({
  userId: Type.String(),
  clubId: Type.String(),
  courseId: Type.String(),
  date: Type.String({format: 'date-time'}),
  playerCount: Type.Integer({minimum: 1, maximum: 4}),
  earliestTime: Type.String({format: 'date-time'}),
  latestTime: Type.String({format: 'date-time'}),
  checkout: Type.Optional(Type.Boolean()),
});

type RequestType = Static<typeof Request>;

const Response = Type.Object({
  executionTime: Type.String({format: 'date-time'}),
});

type ResponseType = Static<typeof Response>;

export default async function scheduleTime(server: FastifyInstance) {
  server.post<{Body: RequestType; Reply: ResponseType}>(
    '/scheduleChronogolf',
    {
      schema: {
        body: Request,
        response: {
          200: Response,
        },
      },
    },
    async (request, reply) => {
      const scheduleDetails: RequestType = request.body;
      const user = await server.getChronogolfUser(scheduleDetails.userId);

      console.log(user);
    }
  );
}
