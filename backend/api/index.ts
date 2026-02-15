import { NestFactory } from '@nestjs/core';
import { AppModule } from '../dist/app.module'; // ✅ import from dist after build
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
    await app.init();
    cachedApp = app;
  }
  return server;
};

export default async (req: any, res: any) => {
  await createServer();
  server(req, res);
};