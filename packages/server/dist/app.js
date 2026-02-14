import fastify from 'fastify';
import cors from '@fastify/cors';
import { healthRoutes } from './routes/health';
export function buildApp() {
    const app = fastify({ logger: true });
    app.register(cors, { origin: true });
    app.register(healthRoutes, { prefix: '/api/v1' });
    return app;
}
