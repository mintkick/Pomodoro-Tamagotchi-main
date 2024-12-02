const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;