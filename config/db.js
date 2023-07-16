const mongoose = require('mongoose');

const config = require('./env-variables');

const { mongodbUrl } = config;

const connect = async () => {
  try {
    const conn = await mongoose.connect(mongodbUrl);
    console.log(`Mongo connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);
    process.exit();
  }
};

module.exports = connect;
