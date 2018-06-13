import Sequelize from 'sequelize';
import dbConfigs from '../config/config.json';

import User from './user';

let sequelize;

const env = process.env.NODE_ENV || 'development';
const config = dbConfigs[env];

if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const models = {
  User: User.init(sequelize, Sequelize),
};

// associate models
Object.values(models)
  .filter(model => typeof model.associate === 'function')
  .forEach(model => model.associate(models));

export default {
  ...models,
  sequelize,
};
