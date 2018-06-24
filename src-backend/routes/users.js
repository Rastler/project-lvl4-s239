import debuglib from 'debug';

import buildFormObj from '../lib/formObjectBuilder';
import { User } from '../models';
import auth from '../lib/auth';

const debug = debuglib('app:routers:user');

export default (router) => {
  router
    .get('users', '/users', async (ctx) => {
      const users = await User.findAll();
      debug('users form database', users);
      ctx.render('users', { users });
    })
    .get('newUser', '/users/new', (ctx) => {
      const user = User.build();
      ctx.render('users/new', { formObj: buildFormObj(user), title: 'Registration' });
    })

    .post('users', '/users', async (ctx) => {
      const form = await ctx.request.body;
      const user = User.build(form);
      debug('Form data:', form);
      try {
        await user.save();
        ctx.flash.set('User has been created');
        ctx.redirect(router.url('root'));
      } catch (err) {
        ctx.render('users/new', { formObj: buildFormObj(user, err) });
      }
    })

    .get(
      'editUser', '/users/:id',
      auth.checkSignIn(router),
      auth.checkRightsToEdit(router),
      async (ctx) => {
        const { id } = ctx.params;
        const user = await User.findOne({
          where: {
            id,
          },
        });

        if (!user) {
          ctx.flash.set('The user does not exist');
          ctx.redirect(router.url('root'));
          return;
        }
        ctx.render('users/edit', { formObj: buildFormObj(user), title: `Edit account: ${user.getFullName()}` });
      },
    )

    .patch(
      'users', '/users',
      auth.checkSignIn(router),
      async (ctx) => {
        const { userId } = ctx.session;

        const user = await User.findOne({
          where: {
            id: userId,
          },
        });

        const form = await ctx.request.body;

        try {
          await user.update(form);
          ctx.flash.set('Your account has been changed.');
          ctx.redirect(router.url('editUser'));
        } catch (err) {
          debug('error', err);
          ctx.render('users/edit', { formObj: buildFormObj(user, err), title: `Edit account: ${user.getFullName()}` });
        }
      },
    )

    .delete(
      'users', '/users',
      auth.checkSignIn(router),
      async (ctx) => {
        const { userId } = ctx.session;

        const user = await User.findOne({
          where: {
            id: userId,
          },
        });


        try {
          await user.destroy();
          ctx.session = {};
          ctx.flash.set('Your account has been destroyed.');
          ctx.redirect(router.url('root'));
        } catch (err) {
          debug('error', err);
          ctx.flash.set('Account already has been destroyed.');
          ctx.redirect(router.url('root'));
        }
      },
    );
};
