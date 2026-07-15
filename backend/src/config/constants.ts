export const CONFIG_KEYS = {
  PORT: 'PORT',
  NODE_ENV: 'NODE_ENV',
  DATABASE_URL: 'DATABASE_URL',
  DIRECT_URL: 'DIRECT_URL',
  JWT_SECRET: 'JWT_SECRET',
  JWT_REFRESH_SECRET: 'JWT_REFRESH_SECRET',
} as const;

export const NODE_ENVS = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TEST: 'test',
  STAGING: 'staging',
} as const;
