import Koa from 'koa';
import Rollbar from 'rollbar';
import dotenv from 'dotenv';

dotenv.config();
const app = new Koa();
const rollbar = new Rollbar(process.env.ROLLBAR_ID);

app.on('error', (err, ctx) => {
  rollbar.log('Server error', err);
})

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
