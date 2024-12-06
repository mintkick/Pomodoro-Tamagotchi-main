const database = require('../database'); 
const { ObjectId } = require('mongodb');

// const db = require('../database').client; // Import the MongoDB client
// const { ObjectId } = require('mongodb');

// models/Task.js
// Remove Mongoose code
// const mongoose = require('mongoose');

// Remove Mongoose schema
// const taskSchema = {
//   userId: { type: String, required: true },
//   dueDate: { type: Date }, // Add dueDate if needed
//   frequency: { type: String }, // Add frequency if needed
// };
//   frequency: { type: String }, // Add frequency if needed
// };

// const Task = mongoose.model('Task', taskSchema);
// const tasksCollection = db.db('Tamadoro').collection('tasks');

async function getCollection(callback){
  try {
    // await database.connectDB();
    console.log("Connected to MongoDB");
    const client = await database.getClient();
    const db = client.db("Tamadoro");
    const collection = db.collection("tasks");

    return await callback(collection);

    
  } catch (err) {
    console.error(err);
  } finally {
    // await database.client.close();
  }
}


module.exports = {
  getTasks: async (userId) => {
    // Ensure userId is correctly used
    return await getCollection(async (collection) => {
      return await collection.find({ userId }).toArray(); 
    })
  },
  createTask: async (task) => {
    return await getCollection(async (collection) => {
      const result = await collection.insertOne(task);
      // return result.ops[0];
      return task;
    })
    
  },
  deleteTask: async (id, userId) => {
    return await tasksCollection.deleteOne({ _id: ObjectId(id), userId });
  },
  updateTask: async (id, userId, updatedData) => {
    return await tasksCollection.findOneAndUpdate(
      { _id: ObjectId(id), userId },
      { $set: updatedData },
      { returnOriginal: false }
    );
  },
};