import debuglib from 'debug';
import dotenv from 'dotenv';
// import faker from 'faker';

import { User, TaskStatus, Task, Tag, TagsForTask } from './models';

dotenv.config();

const debug = debuglib('app:initDb');

const initTables = async () => {
  TaskStatus.hasMany(Task, { foreignKey: 'status', as: 'Tasks' });
  Task.belongsTo(TaskStatus, { foreignKey: 'status', as: 'Status' });

  User.hasMany(Task, { foreignKey: 'creator', as: 'Author' });
  Task.belongsTo(User, { foreignKey: 'creator', as: 'Author' });

  User.hasMany(Task, { foreignKey: 'assignedTo', as: 'Executer' });
  Task.belongsTo(User, { foreignKey: 'assignedTo', as: 'Executer' });

  Task.belongsToMany(Tag, { through: 'TagsForTask' });
  Tag.belongsToMany(Task, { through: 'TagsForTask' });


  try {
    await User.sync({ force: true });
    debug('Create tables User');
  } catch (err) {
    console.err('Error create tables User: ', err);
  }
  try {
    await TaskStatus.sync({ force: true });
    debug('Create tables TaskStatus');
  } catch (err) {
    console.err('Error create tables TaskStatus: ', err);
  }

  try {
    await Task.sync({ force: true });
    debug('Create tables for Tasks');
  } catch (err) {
    console.err('Error create tables for Tasks: ', err);
  }

  try {
    await Tag.sync({ force: true });
    debug('Create tables for Tag');
  } catch (err) {
    console.err('Error create tables for Tag: ', err);
  }

  try {
    await TagsForTask.sync({ force: true });
    debug('Create tables for TagsForTask');
  } catch (err) {
    console.err('Error create tables for TagsForTask: ', err);
  }
};

const addDataToTable = async () => {
  try {
    await User.create({
      firstName: 'Rust',
      lastName: 'Cohle',
      email: 'rust@mail.com',
      password: '123',
    });
    await User.create({
      firstName: 'Martin',
      lastName: 'Hart',
      email: 'martin@mail.com',
      password: '123',
    });
    debug('Add data init to tables Users');
  } catch (err) {
    console.err('Error add data to Users', err);
  }

  try {
    await TaskStatus.bulkCreate([
      { name: 'new' },
      { name: 'in progress' },
      { name: 'aborted' },
      { name: 'complited' },
    ]);
    debug('Add data init to tables TaskStatus');
  } catch (err) {
    console.err('Error add data to TaskStatus', err);
  }

  try {
    await Tag.bulkCreate([
      { name: 'detective' },
      { name: 'writing' },
      { name: 'cool' },
    ]);
    debug('Add data init to tables Tag');
  } catch (err) {
    console.err('Error add data to Tag', err);
  }

  try {
    const task1 = await Task.create({
      name: 'Interrogation of the suspect',
      description: 'Interrogation of a suspect in a murder case',
      status: 1,
      creator: 1,
      assignedTo: 1,
    });
    const task2 = await Task.create({
      name: 'Write a report',
      description: 'To write a record of interrogation',
      status: 1,
      creator: 1,
      assignedTo: 2,
    });
    debug('Add data init to Tasks');
    await task1.setTags([1, 3]);
    await task2.setTags([1, 2, 3]);
    debug('Add tags to task');
  } catch (err) {
    console.err('Error add data to Tasks', err);
  }
};


export default async () => {
  await initTables();
  await addDataToTable();
};
