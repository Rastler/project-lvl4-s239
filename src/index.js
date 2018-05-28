import Koa from 'koa';
import Rollbar from 'rollbar';

const app = new Koa();
const rollbar = new Rollbar('adb75d0f2ad7418d9f33a19568827e0d');

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  rollbar.log(`${ctx.method}: ${ctx.url} - ${ms}`);
});

app.use(async (ctx) => {
  ctx.body = 'Hello World';
});

export default app;
