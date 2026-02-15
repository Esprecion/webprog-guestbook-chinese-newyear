import { NestFactory } from '@nestjs/core';
import { AppModule } from '../backend/dist/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

const server = express();
let cachedApp: any;

export const createServer = async () => {
  if (!cachedApp) {
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(server)
    );
    app.enableCors();
    app.setGlobalPrefix('api'); // ← CRITICAL: add this line
    await app.init();

    // Debug: print registered routes
    const httpServer = app.getHttpServer();
    const router = httpServer._events.request?._router;
    if (router) {
      console.log('Registered routes:');
      router.stack.forEach((layer: any) => {
        if (layer.route) {
          console.log(`${Object.keys(layer.route.methods)} ${layer.route.path}`);
        }
      });
    }

    cachedApp = app;
  }
  return server;
};

export default async (req: any, res: any) => {
  await createServer();
  server(req, res);
};