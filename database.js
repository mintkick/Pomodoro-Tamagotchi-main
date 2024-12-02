const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error(err);
    process.exit(1); // Exit process with failure
  }
}

// Remove automatic connection to allow controlled initialization
// connectDB();

module.exports = {
  client,
  connectDB,
};