const db = require('../database').client;
const { ObjectId } = require('mongodb');

const tasksCollection = db.db('tasks').collection('tasks');

module.exports = {
  getTasks: async (filter = {}) => {
    return await tasksCollection.find(filter).toArray();
  },
  createTask: async (task) => {
    // Ensure the task includes a 'type' field ('daily' or 'scheduled')
    const result = await tasksCollection.insertOne(task);
    return { _id: result.insertedId, ...task };
  },
  deleteTask: async (id) => {
    return await tasksCollection.deleteOne({ _id: ObjectId(id) });
  },
  updateTask: async (id, updatedData) => {
    const result = await tasksCollection.findOneAndUpdate(
      { _id: ObjectId(id) },
      { $set: updatedData },
      { returnDocument: 'after' } // Use 'returnOriginal: false' if using an older MongoDB driver
    );
    return result.value;
  },
};