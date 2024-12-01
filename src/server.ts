import Fastify from 'fastify';
import historyRoutes from './routes/historyRoutes';

const fastify = Fastify({ logger: true });

fastify.register(historyRoutes, { prefix: '/api/history' });

fastify.listen({ port: 4000 }, () => {
    console.log('History Service running on port 4000');
});
