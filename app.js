const express = require('express');
const Task = require('./models/Task'); // Import Task model
const db = require('./database'); // Import database.js
require('dotenv').config();
const { ObjectId } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the public directory
app.use(express.static('public'));

app.use(express.json()); // Add JSON parsing middleware

db.connectDB(); // Initialize database connection

// Remove authentication checks in routes
app.get('/', (req, res) => {
  res.send('Welcome');
});

app.get('/user', (req, res) => {
  res.json(null);
});

// Get all tasks
app.get('/tasks', async (req, res) => {
  try {
    const { type } = req.query;
    const filter = type ? { type } : {};
    const tasks = await Task.getTasks(filter);
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new task
app.post('/tasks', async (req, res) => {
  try {
    const task = req.body;
    if (!task.title || !task.type) {
      return res.status(400).json({ error: 'Task title and type are required' });
    }
    const createdTask = await Task.createTask(task);
    res.status(201).json(createdTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a task
app.put('/tasks/:id', async (req, res) => {
  try {
    const updatedTask = await Task.updateTask(req.params.id, req.body);
    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a task
app.delete('/tasks/:id', async (req, res) => {
  try {
    const result = await Task.deleteTask(req.params.id);
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task deleted' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});