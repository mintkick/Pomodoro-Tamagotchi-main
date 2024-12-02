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
  getTasks: async (userId) => {
    // Ensure userId is correctly used
    return await tasksCollection.find({ userId }).toArray();
  },
  createTask: async (task) => {
    const result = await tasksCollection.insertOne(task);
    return result.ops[0];
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