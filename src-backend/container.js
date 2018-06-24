import dotenv from 'dotenv';

import models from './models';
// import logger from './lib/logger';
// import { initTables, addDataToTable } from './initDb';

dotenv.config();

export default {
  ...models,
};

