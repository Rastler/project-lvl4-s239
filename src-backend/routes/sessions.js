import debugLib from 'debug';
import dotenv from 'dotenv';

import { encrypt } from '../lib/secure';
import { User } from '../models';
import formObjectBuilder from '../lib/formObjectBuilder';

dotenv.config();

const debug = debugLib('app:routes:sessions');

export default (router) => {
  router
    .get('newSession', '/session/new', async (ctx) => {
      const data = ctx.request.body || {};
      ctx.render('sessions/new', { formObj: formObjectBuilder(data), title: 'Sign In' });
    })


    .post('session', '/session', async (ctx) => {
      const form = ctx.request.body;
      const user = await User.findOne({
        where: {
          email: form.email.toLowerCase(),
        },
      });

      if (user && user.passwordDigest === encrypt(form.password)) {
        ctx.session.userId = user.id;
        debug('Correct password, you were authenticated');
        debug('ctx.session:', ctx.session);

        ctx.flash.set(`Welcome, ${user.getFullName()}`);
        ctx.set('Authenticated', 'yes');
        ctx.redirect(router.url('tasks'));
        return;
      }
      debug('User obj: ', user);
      const err = {
        errors:
        [
          { path: 'email', message: 'Email or password were wrong' },
          { path: 'password' },
        ],
      };
      ctx.set('Authenticated', 'no');
      ctx.render('sessions/new', { formObj: formObjectBuilder(form, err), title: 'Error sign in' });
    })


    .delete('sessionDelete', '/session', async (ctx) => {
      debug('ctx.session:', ctx.session);
      debug('ctx.body', ctx.body);
      ctx.session = {};
      ctx.flash.set('Sign out, goodby!');
      ctx.redirect(router.url('root'));
    });
};
