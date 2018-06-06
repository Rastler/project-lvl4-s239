import Sequelize from 'sequelize';

import User from './User';

const sequelize = new Sequelize();

const models = {
  User: User.init(sequelize, Sequelize),
};

// Run `.associate` if it exists,
// ie create relationships in the ORM
Object.values(models)
  .filter(model => typeof model.associate === 'function')
  .forEach(model => model.associate(models));

export default () => ({
  ...models,
  sequelize,
});
