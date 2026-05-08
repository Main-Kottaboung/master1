const env = require('./env');

const config = {
  port: Number(env.PORT) || 3000,
  nodeEnv: env.NODE_ENV || 'development',
  jwtSecret: env.JWT_SECRET || 'change-me',
  jwtExpiresIn: env.JWT_EXPIRES_IN || '1h',
};

module.exports = config;
