const db = require('../database').client; // Import the MongoDB client
const { ObjectId } = require('mongodb');

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
const tasksCollection = db.db('tasks').collection('tasks');

module.exports = {
  getTasks: async () => {
    return await tasksCollection.find({}).toArray(); // Removed userId filter
  },
  createTask: async (task) => {
    const result = await tasksCollection.insertOne(task);
    return result.ops[0];
  },
  deleteTask: async (id) => {
    return await tasksCollection.deleteOne({ _id: ObjectId(id) }); // Removed userId filter
  },
  updateTask: async (id, updatedData) => {
    return await tasksCollection.findOneAndUpdate(
      { _id: ObjectId(id) },
      { $set: updatedData },
      { returnOriginal: false }
    );
  },
};