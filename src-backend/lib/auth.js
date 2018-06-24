export default {
  checkSignIn: ((router, msg = 'You must be sign in.') => async (ctx, next) => {
    if (ctx.state.isSignedIn()) {
      await next();
      return;
    }

    ctx.flash.set(msg);
    ctx.redirect(router.url('newSession'));
  }),
  checkRightsToEdit: (router => async (ctx, next) => {
    const { userId } = ctx.session;
    const { id } = ctx.params;
    if (Number(userId) === Number(id)) {
      await next();
      return;
    }
    ctx.flash.set('You do not have permission.');
    ctx.redirect(router.url('root'));
  }),
};
