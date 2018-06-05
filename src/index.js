import Koa from 'koa';
import Router from 'koa-router';
import logger from 'koa-logger';
import serve from 'koa-static';
import Rollbar from 'rollbar';
import pathlib from 'path';
import debug from 'debug';

import config from './config';

const rollbar = new Rollbar({
  accessToken: config.rollbarId,
  captureUncaught: true,
  captureUnhandledRejections: true,
});

const app = new Koa();
const router = new Router();

app.use(logger());

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    debug(err, ctx.request);
    rollbar.error(err, ctx.request);
    console.error(err, ctx.request);
  }
});

app.use(serve(pathlib.resolve('dist/client-app/')));

// router.get('/', (ctx, next) => {
//   ctx.body = 'Hello World!';
//   next();
// });

// app.use(router.routes());

// app.on('error', errorsHandler);

export default app;
