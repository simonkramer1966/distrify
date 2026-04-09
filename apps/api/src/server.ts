import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import type { HealthResponse } from '@distrify/shared';

const app = Fastify({ logger: true });

async function start(): Promise<void> {
  await app.register(cors, { origin: true });

  app.get('/api/health', async (): Promise<HealthResponse> => ({ status: 'ok' }));

  const port = Number(process.env.API_PORT ?? 4000);
  try {
    await app.listen({ port, host: '0.0.0.0' });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

void start();
