import debuglib from 'debug';
import dotenv from 'dotenv';

import { Task, User, Tag, TaskStatus } from '../models';
import helper from '../lib/helper';
import auth from '../lib/auth';

dotenv.config();

const debug = debuglib('app:router:tasks');

export default (router) => {
  router
    .get('tasks', '/tasks', auth.checkSignIn(router), async (ctx) => {
      const allUsers = await User.findAll();
      const allStatuses = await TaskStatus.findAll();

      if (Object.keys(ctx.query).length === 0) {
        const allTasks = await Task.findAll();
        const preparedTasks = await helper.prerapeTaskList(allTasks);
        ctx.render('tasks', {
          tasks: preparedTasks, allUsers, allStatuses, title: 'Task List',
        });
        return;
      }

      debug('ctx.query:', ctx.query);

      const queryObject = ctx.query;
      const { userId } = await ctx.session;

      const options = helper.buildSearchOptions(queryObject, userId);
      debug('Search options:\n', options);

      const filteredTasks = await Task.findAll(options);
      const preparedTasks = await helper.prerapeTaskList(filteredTasks);

      const selectedStatus = await helper.getValueById(TaskStatus, queryObject.filtredStatus, 'name');
      const selectedExecuter = await helper.getFullUserNameById(User, queryObject.filtredExecuter);
      const checked = queryObject.userTaskOnly;
      const { searchTags } = queryObject;

      ctx.render('tasks', {
        selectedStatus,
        selectedExecuter,
        checked,
        tasks: preparedTasks,
        allUsers,
        allStatuses,
        searchTags,
        title: 'Task List',
      });
    })

    .get('newTask', '/tasks/new', auth.checkSignIn(router), async (ctx) => {
      const users = await User.findAll();
      const task = await Task.build();
      ctx.render('tasks/new', { formObj: helper.formObjectBuilder(task), users, title: 'New task' });
    })

    .get('editTask', '/tasks/:id', auth.checkSignIn(router), async (ctx) => {
      const { id } = ctx.params;
      const allUsers = await User.findAll();
      const allStatuses = await TaskStatus.findAll();
      const task = await Task.findById(id);
      const tags = await task.getTags();
      const tagsString = tags.map(tag => tag.name).join(', ');
      const currentStatusObj = await task.getStatus();
      const currentStatus = await currentStatusObj.name;
      const currentExecuterObj = await task.getExecuter();
      const currentExecuter = await currentExecuterObj.getFullName();

      ctx.render('tasks/edit', {
        currentExecuter,
        currentStatus,
        allStatuses,
        allUsers,
        tags: tagsString,
        formObj: helper.formObjectBuilder(task),
        title: 'Task edit',
      });
    })


    .post('tasks', '/tasks', auth.checkSignIn(router), async (ctx) => {
      const { userId } = await ctx.session;
      const form = await ctx.request.body;
      const executerId = form.executer;
      const tags = helper.parseTagsString(form.tags);
      const task = await Task.build(form);

      try {
        await task.save();
        await task.setStatus(1); // add default status New
        await task.setAuthor(userId);
        await task.setExecuter(executerId);
        helper.setTags(Tag, tags, task);

        ctx.flash.set('Task has been created');
        ctx.redirect(router.url('tasks'));
      } catch (err) {
        debug(err);
        const users = await User.findAll();
        ctx.render('tasks/new', { formObj: helper.formObjectBuilder(task, err), users, title: 'New task(error)' });
      }
    })

    .patch('changeTask', '/tasks/:id', auth.checkSignIn(router), async (ctx) => {
      const { id } = ctx.params;
      const form = await ctx.request.body;
      const executerId = form.executer;
      const tags = helper.parseTagsString(form.tags);
      const users = await User.findAll();
      const statuses = await TaskStatus.findAll();
      const task = await Task.findOne({
        where: {
          id,
        },
      });

      const statusId = form.status;

      try {
        await task.update(form);
        await task.setStatus(statusId);
        await task.setExecuter(executerId);
        helper.setTags(Tag, tags, task);

        ctx.flash.set('Task has been updated');
        ctx.redirect(router.url('tasks'));
      } catch (err) {
        debug(err);
        const currentStatusObj = await task.getStatus();
        const currentStatus = await currentStatusObj.name;
        const currentExecuterObj = await task.getExecuter();
        const currentExecuter = await currentExecuterObj.getFullName();
        const tagsString = tags.join(', ');
        ctx.render('tasks/edit', {
          currentStatus,
          currentExecuter,
          users,
          statuses,
          tags: tagsString,
          formObj: helper.formObjectBuilder(task, err),
          title: 'Edit Task (errors)',
        });
      }
    })

    .delete('deleteTask', '/tasks/:id', auth.checkSignIn(router), async (ctx) => {
      const { id } = ctx.params;

      const task = await Task.findOne({
        where: {
          id,
        },
      });

      try {
        await task.destroy();
        ctx.flash.set(`Task "${task.name}" has been deleted`);
        ctx.redirect(router.url('tasks'));
      } catch (err) {
        debug('err');
        ctx.flash.set('Error happened when deleting task');
        ctx.redirect(router.url('tasks'));
      }
    });
};
