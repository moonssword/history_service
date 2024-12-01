import { FastifyInstance } from 'fastify';
import { logAction, getActions } from '../controllers/historyController.js';

async function historyRoutes(fastify: FastifyInstance) {
    fastify.post('/actions', logAction);
    fastify.get('/actions', getActions);
}

export default historyRoutes;
