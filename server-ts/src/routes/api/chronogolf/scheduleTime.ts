import {FastifyInstance} from 'fastify';
import {Static, Type} from '@sinclair/typebox';
import {DateTime} from 'luxon';
import {Job} from 'agenda';

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

const ErrorType = Type.Object({
  message: Type.String(),
});

type Error = Static<typeof ErrorType>;

export default async function scheduleTime(server: FastifyInstance) {
  server.post<{Body: Request; Reply: Response | Error}>(
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
      if (user === null) {
        reply.status(400);
        reply.send({message: 'Invalid user!'});
        return;
      }

      const club = await server.getChronogolfClub(scheduleDetails.clubId);
      if (club === null) {
        reply.status(400);
        reply.send({message: 'Invalid club!'});
        return;
      }

      // Generate a unique taskId for the agenda
      const taskId = `${scheduleDetails.userId};${scheduleDetails.courseId};${scheduleDetails.date}`;
      const agenda = server.agenda;

      const jobs = await agenda.jobs({
        name: taskId,
        nextRunAt: {$exists: true},
      });

      if (jobs !== null && jobs.length !== 0) {
        reply.status(400);
        reply.send({message: 'Tee time is already scheduled!'});
        return;
      }

      agenda.define(taskId, (job: Job) => {
        console.log(`Starting service for task: ${taskId}`);
        console.log(job.attrs.data);
        // Book time here
      });

      const now = DateTime.now();
      const teeTimeDate = DateTime.fromISO(scheduleDetails.date);

      const scheduleCutoff = teeTimeDate.minus({
        days: club.scheduleOffsetDays,
        hours: 24 - club.scheduleOffsetHours,
      });

      if (scheduleCutoff > now) {
        console.log(`Scheduling job: ${taskId}`);
        agenda.schedule(scheduleCutoff.toJSDate(), taskId, scheduleDetails);
      } else {
        console.log(`Executing job immediately: ${taskId}`);
        agenda.now(taskId, scheduleDetails);
      }
    }
  );
}
