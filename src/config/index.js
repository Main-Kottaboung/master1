const env = require('./env');

const config = {
  port: Number(env.PORT) || 3000,
  nodeEnv: env.NODE_ENV || 'development',
};

module.exports = config;
