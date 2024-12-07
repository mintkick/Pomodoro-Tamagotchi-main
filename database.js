// const { MongoClient } = require('mongodb');
// require('dotenv').config();

// const uri = process.env.MONGODB_URI;
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// async function connectDB() {
//   try {
//     await client.connect();
//     console.log('Connected to MongoDB');
//   } catch (err) {
//     console.error(err);
//     process.exit(1); // Exit process with failure
//   }
// }

// // Remove automatic connection to allow controlled initialization
// // connectDB();

// module.exports = {
//   client,
//   connectDB,
// };

const { MongoClient } = require('mongodb');

let client;
let isConnected = false;

async function connectDB() {
  if (!isConnected) {
    client = new MongoClient(process.env.MONGODB_URI, { useUnifiedTopology: true });
    await client.connect();
    isConnected = true;
    console.log("MongoDB connected");
  }
  return client;
}

async function closeDB() {
  if (client && isConnected) {
    await client.close();
    isConnected = false;
    console.log("MongoDB connection closed");
  }
}

module.exports = {
  connectDB,
  getClient: async () => {
    if (!isConnected) await connectDB();
    return client;
  },
  closeDB,
};