import debugLib from 'debug';
import dotenv from 'dotenv';

import buildFormObj from '../lib/formObjectBuilder';
import { encrypt } from '../lib/secure';
import { User } from '../models';

dotenv.config();

const debug = debugLib('app:routes:sessions');

export default (router) => {
  router
    .get('newSession', '/session/new', async (ctx) => {
      const data = {};
      ctx.render('sessions/new', { formObj: buildFormObj(data), title: 'SignIn' });
    })


    .post('session', '/session', async (ctx) => {
      const { email, password } = ctx.request.body;
      const user = await User.findOne({
        where: {
          email: email.toLowerCase(),
        },
      });

      if (user && user.passwordDigest === encrypt(password)) {
        ctx.session.userId = user.id;
        debug('Correct password, you were authenticated');
        debug('ctx.session:', ctx.session);

        ctx.flash.set(`Welcome, ${user.getFullName()}`);
        ctx.set('Authenticated', 'yes');
        ctx.redirect(router.url('root'));
        return;
      }

      ctx.flash.set('Email or password were wrong');
      ctx.set('Authenticated', 'no');
      ctx.redirect(router.url('newSession'));
    })


    .delete('sessionDelete', '/session', async (ctx) => {
      debug('ctx.session:', ctx.session);
      debug('ctx.body', ctx.body);
      ctx.session = {};
      ctx.flash.set('Sign out, goodby!');
      ctx.redirect(router.url('root'));
    });
};
