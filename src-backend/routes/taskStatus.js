import debugLib from 'debug';

import { TaskStatus } from '../models';
import auth from '../lib/auth';
import helper from '../lib/helper';

const debug = debugLib('app:routes:taskStatus');

export default (router) => {
  router
    .get('taskStatus', '/taskstatus', auth.checkSignIn(router), async (ctx) => {
      const statuses = await TaskStatus.findAll();
      const status = await TaskStatus.build({});
      debug('status:', status);
      ctx.render('taskstatus', { statuses, formObj: helper.formObjectBuilder(status), title: 'Task status listing' });
    })

    .get('newTaskStatus', '/taskstatus/new', auth.checkSignIn(router), async (ctx) => {
      const taskStatus = TaskStatus.build();
      ctx.render('taskstatus/new', { formObj: helper.formObjectBuilder(taskStatus), title: 'Add new task status' });
    })

    .post('taskStatus', '/taskstatus', auth.checkSignIn(router), async (ctx) => {
      const form = await ctx.request.body;
      const taskStatus = TaskStatus.build(form);
      debug('Form data:', form);
      try {
        await taskStatus.save();
        ctx.flash.set(`Task status '${form.name}' has been created`);
        ctx.redirect(router.url('taskStatus'));
      } catch (err) {
        ctx.render('taskstatus/new', { formObj: helper.formObjectBuilder(taskStatus, err) });
      }
    })

    .get('editTaskStatus', '/taskstatus/:id', auth.checkSignIn(router), async (ctx) => {
      const { id } = ctx.params;
      const taskStatus = await TaskStatus.findOne({
        where: {
          id,
        },
      });
      debug('task status obj', taskStatus);
      if (!taskStatus) {
        ctx.flash.set('This task status does not exist');
        ctx.redirect(router.url('taskStatus'));
        return;
      }
      ctx.render('taskstatus/edit', { formObj: helper.formObjectBuilder(taskStatus), title: `Edit task status: ${taskStatus.name}` });
    })

    .patch(
      'patchTaskStatus', '/taskstatus/:id',
      auth.checkSignIn(router),
      async (ctx) => {
        const { id } = ctx.params;

        const taskStatus = await TaskStatus.findOne({
          where: {
            id,
          },
        });

        const form = await ctx.request.body;

        try {
          await taskStatus.update(form);
          ctx.flash.set('Task status has been changed.');
          ctx.redirect(router.url('taskStatus'));
        } catch (err) {
          debug('error', err);
          ctx.render('taskstatus/edit', { formObj: helper.formObjectBuilder(taskStatus, err), title: `Edit task status: ${taskStatus.name}` });
        }
      },
    )

    .delete('deleteTaskStatus', '/taskstatuses/:id', auth.checkSignIn(router), async (ctx) => {
      const { id } = ctx.params;
      const taskStatus = await TaskStatus.findOne({
        where: {
          id,
        },
      });

      await taskStatus.destroy();
      ctx.flash.set(`Status "${taskStatus.name}" has been deleted`);
      ctx.redirect(router.url('taskStatus'));
    });
};

