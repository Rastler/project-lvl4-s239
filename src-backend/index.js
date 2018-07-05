import Koa from 'koa';
import serve from 'koa-static-server';
import Router from 'koa-router';
import Rollbar from 'rollbar';
import koaLogger from 'koa-logger';
import pathlib from 'path';
import debuglib from 'debug';
import dotenv from 'dotenv';
import session from 'koa-generic-session';
import flash from 'koa-flash-simple';
import bodyParser from 'koa-bodyparser';
import methodOverride from 'koa-methodoverride';
import Pug from 'koa-pug';
import _ from 'lodash';

import addRoutes from './routes';
import container from './container';

dotenv.config();

const debug = debuglib('app:server');


const rollbar = new Rollbar({
  accessToken: process.env.ROLLBAR_TD,
  captureUncaught: true,
  captureUnhandledRejections: true,
});

const app = new Koa();
const router = new Router();

app.keys = ['session key'];

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    debug(err, ctx.request);
    rollbar.error(err, ctx.request);
    console.error(err, ctx.request);
  }
});

if (process.env.NODE_ENV !== 'test') {
  app.use(koaLogger());
}

app.use(session(app));
app.use(flash());
app.use(async (ctx, next) => {
  ctx.state = {
    flash: ctx.flash,
    isSignedIn: () => ctx.session.userId !== undefined,
    getUserId: () => ctx.session.userId,
  };
  await next();
});
app.use(bodyParser());
app.use(methodOverride((req) => {
  debug('methodOverride, req.body', req.body);
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    return req.body._method; // eslint-disable-line
  }
  return null;
}));
app.use(serve({
  rootDir: pathlib.resolve('dist/static/'),
  rootPath: '/static',
}));
addRoutes(router, container);
app.use(router.allowedMethods());
app.use(router.routes());

const pug = new Pug({
  viewPath: pathlib.join(__dirname, 'views'),
  noCache: process.env.NODE_ENV === 'development',
  debug: true,
  pretty: false,
  compileDebug: true,
  locals: [],
  basedir: pathlib.join(__dirname, 'views'),
  helperPath: [
    { _ },
    { urlFor: (...args) => router.url(...args) },
  ],
});
pug.use(app);

export default app;
