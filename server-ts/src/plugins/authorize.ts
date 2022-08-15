import {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyRequest,
  FastifyReply,
} from 'fastify';
import fp from 'fastify-plugin';

// Add additional fields onto jwt data
declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: {
      permissions: [string];
    };
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    authorize: (
      request: FastifyRequest,
      reply: FastifyReply,
      permissions?: [string]
    ) => void;
  }

  interface FastifyRequest {
    permissions: [string];
  }
}

// TODO: Need a way to add permissions to the request before preValidation is called
const authorize: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.decorate(
    'authorize',
    async (
      request: FastifyRequest,
      reply: FastifyReply,
      permissions?: [string]
    ) => {
      // First authenticate
      await fastify.authenticate(request, reply);

      const userPermissions = request.user.permissions;

      if (permissions && !permissions.every(p => userPermissions.includes(p))) {
        reply.status(401);
        return;
      }
    }
  );
};

export default fp(authorize, {
  name: 'auth',
});
