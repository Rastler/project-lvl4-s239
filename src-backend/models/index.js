import fs from 'fs';
import path from 'path';
import debuglib from 'debug';

const Sequelize = require('sequelize');

const debug = debuglib('app:models');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const configFile = fs.readFileSync(path.resolve('src-backend/config/config.json'));
const config = JSON.parse(configFile)[env];
const db = {};
let sequelize;

if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, { ...config, logging: msg => debug('%s', msg) });
}

fs
  .readdirSync(__dirname)
  .filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
  if (db[modelName].loadScopes) {
    db[modelName].loadScopes(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
