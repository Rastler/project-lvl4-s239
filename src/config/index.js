import dotenv from 'dotenv';

dotenv.config();

export default () => ({
  server: {
    port: process.env.PORT || 5000,
    rollbarId: process.env.ROLLBAR_ID,
  },
  db: {
    dialect: 'sqlite',
    storage: 'database.sqlite',
  },
});
