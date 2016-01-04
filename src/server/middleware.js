import path from 'path';
import express from 'express';
import serveStatic from 'serve-static';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import api from './middleware/api';
import renderer from './middleware/renderer';

export default function (app) {
  const STATIC_DIR = path.join(__dirname, '../..', 'static');
  const router = express.Router();

  router.use(compression());

  router.use(serveStatic(STATIC_DIR));

  router.use(cookieParser());

  router.use('/api', api(app));

  router.use(renderer(app));

  return router;
}
