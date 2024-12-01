import { logAction, getActions } from '../controllers/historyController.js';
async function historyRoutes(fastify) {
    fastify.post('/actions', logAction);
    fastify.get('/actions', getActions);
}
export default historyRoutes;
