#!/usr/bin/env node
import dotenv from 'dotenv';
import debuglib from 'debug';

import app from '..';
import initDb from '../initDb';

dotenv.config();

const debug = debuglib('app:start');
const port = process.env.PORT || 5000;

initDb();
app.listen(port, () => {
  console.log('Server started on port:', port);
  debug('Server listening on port ', port);
});
