const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  port: process.env.PORT,

  origin: isProd ? process.env.REMOTE_APP_URL : process.env.LOCAL_APP_URL,
  mongodbUrl: !isProd
    ? process.env.MONGO_DB_REMOTE_URL
    : process.env.MONGO_DB_LOCAL_URL,
};
