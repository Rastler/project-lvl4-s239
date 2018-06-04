import Koa from 'koa';
import Router from 'koa-router';
import logger from 'koa-logger';
import Rollbar from 'rollbar';
import debug from 'debug';

import config from './config';

const rollbar = new Rollbar(config.rollbarId);

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

router.get('/', (ctx, next) => {
  ctx.body = 'Hello World!';
  next();
});

app.use(router.routes());

// app.on('error', errorsHandler);

export default app;
