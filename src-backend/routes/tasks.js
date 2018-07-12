import debuglib from 'debug';
import dotenv from 'dotenv';

import { Task, User, Tag, TaskStatus } from '../models';
import parseTagsString from '../lib/parseTagsString';
import setTagsForTask from '../lib/setTagsToTask';
import formObjectBuilder from '../lib/formObjectBuilder';
import auth from '../lib/auth';

dotenv.config();

const debug = debuglib('app:router:tasks');

export default (router) => {
  router
    .get('tasks', '/tasks', async (ctx) => {
      const allUsers = await User.findAll();
      const allStatuses = await TaskStatus.findAll();

      if (Object.keys(ctx.query).length === 0) {
        const tasks = await Task.findAll({ include: [{ all: true }] });
        ctx.render('tasks', {
          tasks, allUsers, allStatuses, title: 'Task List',
        });
        return;
      }

      debug('ctx.query:', ctx.query);

      const {
        filtredStatus,
        filtredExecuter,
        userTaskOnly,
        searchTags,
      } = ctx.query;
      const { userId } = await ctx.session;
      const scope = [];
      if (userId && userId !== '0') {
        scope.push({ method: ['onlyAuthorId', userId] });
      }
      if (filtredStatus && filtredStatus !== '0') {
        scope.push({ method: ['onlyStatusId', filtredStatus] });
      }
      if (filtredExecuter && filtredExecuter !== '0') {
        scope.push({ method: ['assignToId', filtredExecuter] });
      }
      if (searchTags) {
        const tagsArr = parseTagsString(searchTags);
        scope.push({ method: ['hasTag', tagsArr[0]] });
      }
      debug('Scope options:\n', scope);

      const filteredTasks = await Task.scope(scope).findAll({
        include: [
          { all: true, nested: true },
        ],
      });

      const selectedStatus = await TaskStatus.findOne({
        where: {
          id: filtredStatus,
        },
      });
      const selectedExecuter = await User.findOne({
        where: {
          id: filtredExecuter,
        },
      });

      const selectedStatusName = selectedStatus ? selectedStatus.name : 'any';
      const selectedExecuterFullName = selectedExecuter ? selectedExecuter.getFullName() : 'any';

      ctx.render('tasks', {
        selectedStatus: selectedStatusName,
        selectedExecuter: selectedExecuterFullName,
        checked: userTaskOnly,
        tasks: filteredTasks,
        allUsers,
        allStatuses,
        searchTags,
        title: 'Task List',
      });
    })

    .get('newTask', '/tasks/new', auth.checkSignIn(router), async (ctx) => {
      const users = await User.findAll();
      const task = await Task.build();
      ctx.render('tasks/new', { formObj: formObjectBuilder(task), users, title: 'New task' });
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
        formObj: formObjectBuilder(task),
        title: 'Task edit',
      });
    })


    .post('tasks', '/tasks', auth.checkSignIn(router), async (ctx) => {
      const { userId } = await ctx.session;
      const form = await ctx.request.body;
      const executerId = form.executer;
      const tags = parseTagsString(form.tags);
      const task = await Task.build(form);

      try {
        await task.save();
        await task.setStatus(1); // add default status New
        await task.setAuthor(userId);
        await task.setExecuter(executerId);
        setTagsForTask(Tag, tags, task);

        ctx.flash.set('Task has been created');
        ctx.redirect(router.url('tasks'));
      } catch (err) {
        debug(err);
        const users = await User.findAll();
        ctx.render('tasks/new', { formObj: formObjectBuilder(task, err), users, title: 'New task(error)' });
      }
    })

    .patch('changeTask', '/tasks/:id', auth.checkSignIn(router), async (ctx) => {
      const { id } = ctx.params;
      const form = await ctx.request.body;
      const executerId = form.executer;
      const tags = parseTagsString(form.tags);
      const users = await User.findAll();
      const statuses = await TaskStatus.findAll();
      const task = await Task.findOne({
        where: {
          id,
        },
      });

      const statusId = form.status;

      try {
        debug('From object: \n', form);
        await task.update(form);
        await task.setStatus(statusId);
        await task.setExecuter(executerId);
        const oldTags = await task.getTags();
        debug('Exists tags: \n', oldTags);
        setTagsForTask(Tag, tags, task);

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
          formObj: formObjectBuilder(task, err),
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
