const express = require('express');
// const { auth } = require('express-openid-connect'); // Removed authentication
const Task = require('./models/Task'); // Import Task model
const db = require('./database'); // Import database.js
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// const config = { /* ... */ }; // Removed auth config

// app.use(auth(config)); // Removed authentication middleware

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

// CRUD Routes for Tasks without authentication
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.getTasks(); // Modify Task.getTasks to not require userId
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/tasks', async (req, res) => {
  const { text, dueDate, frequency } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Task text is required' });
  }
  try {
    const newTask = {
      text,
      dueDate: dueDate || null,
      frequency: frequency || 'daily',
      completed: false,
    };
    const savedTask = await Task.createTask(newTask);
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/tasks/:id', async (req, res) => {
  try {
    const result = await Task.deleteTask(req.params.id);
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/tasks/:id', async (req, res) => {
  const { text, completed, dueDate, frequency } = req.body;
  try {
    const updatedData = {};
    if (text !== undefined) updatedData.text = text;
    if (completed !== undefined) updatedData.completed = completed;
    if (dueDate !== undefined) updatedData.dueDate = dueDate;
    if (frequency !== undefined) updatedData.frequency = frequency;

    const updatedTask = await Task.updateTask(req.params.id, updatedData);
    if (!updatedTask.value) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(updatedTask.value);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});