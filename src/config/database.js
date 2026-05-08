const env = require('./env');

const databaseConfig = {
  url: env.DATABASE_URL || '',
  name: env.DATABASE_NAME || 'master1',
  dialect: env.DATABASE_DIALECT || 'postgres',
};

module.exports = databaseConfig;
