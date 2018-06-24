import debuglib from 'debug';
import dotenv from 'dotenv';
import { User } from './models';

dotenv.config();

const debug = debuglib('app:initDb');

const initTables = async () => {
  try {
    await User.sync({ force: true });
    debug('Create tables');
  } catch (err) {
    console.err('Error Create tables: ', err);
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
    debug('Add data init to tables');
  } catch (err) {
    console.err('Error add data', err);
  }
};

export default async () => {
  await initTables();
  await addDataToTable();
};
