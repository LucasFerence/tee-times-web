import {FastifyInstance} from 'fastify';
import {User, UserType} from 'src/schema/chronogolf/user';

export default async function registerUser(server: FastifyInstance) {
  server.post<{Body: UserType}>(
    '/registerChronogolfUser',
    {
      schema: {
        body: User,
      },
    },
    async (request, reply) => {
      const user: UserType = request.body;
      const collection = server.mongo.db?.collection('chronogolfUsers');

      const filter = {id: user.id};
      const options = {upsert: true};

      const updateDoc = {
        $set: {
          username: user.username,
          password: user.password,
        },
      };

      await collection?.updateOne(filter, updateDoc, options);

      reply.status(200);
    }
  );
}
