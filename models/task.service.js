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
    return await getCollection(async (collection) => {
      return await collection.find({ userId }).toArray();
    });
  },

  createTask: async (task) => {
    return await getCollection(async (collection) => {
      const result = await collection.insertOne({
        ...task,
        id: new ObjectId().toString() // Ensure each task has a unique id
      });
      return { ...task, id: result.insertedId };
    });
  },

  deleteTask: async (id) => {
    return await getCollection(async (collection) => {
      return await collection.deleteOne({ _id: new ObjectId(id) });
    });
  },

  updateTask: async (id, updatedData) => {
    return await getCollection(async (collection) => {
      return await collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updatedData },
        { returnDocument: 'after' }
      );
    });
  }
};