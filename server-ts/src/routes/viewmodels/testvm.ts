import {IConfig} from 'config';
import {FastifyInstance} from 'fastify';

async function test(server: FastifyInstance) {
  server.get('/test', async request => {
    const dbConfig: IConfig = server.config.get('db');
    const port = dbConfig.get('port');

    console.log(port);
  });
}

export default test;
