const mongoose = require('mongoose');

async function connectDatabase(connectionString) {
  if (!connectionString) {
    throw new Error('Database connection string is missing');
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  await mongoose.connect(connectionString, {
    autoIndex: true,
  });

  return mongoose.connection;
}

module.exports = connectDatabase;
