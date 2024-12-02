const express = require('express');
const { auth } = require('express-openid-connect');
const Task = require('./models/Task'); // Import Task model
const db = require('./database'); // Import database.js
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000; // Change the port number to 3001

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
};

app.use(auth(config));

// Serve static files from the public directory
app.use(express.static('public'));

app.use(express.json()); // Add JSON parsing middleware

db.connectDB(); // Initialize database connection

// Middleware to check authentication
function ensureAuthenticated(req, res, next) {
  if (req.oidc.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized' });
}

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

// Route to fetch user information
app.get('/user', (req, res) => {
  if (req.oidc.isAuthenticated()) {
    res.json(req.oidc.user);
  } else {
    res.json(null);
  }
});

// CRUD Routes for Tasks
app.get('/tasks', ensureAuthenticated, async (req, res) => {
  try {
    const tasks = await Task.getTasks(req.oidc.user.sub);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/tasks', ensureAuthenticated, async (req, res) => {
  const { text, dueDate, frequency } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Task text is required' });
  }
  try {
    const newTask = {
      userId: req.oidc.user.sub,
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

app.delete('/tasks/:id', ensureAuthenticated, async (req, res) => {
  try {
    const result = await Task.deleteTask(req.params.id, req.oidc.user.sub);
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/tasks/:id', ensureAuthenticated, async (req, res) => {
  const { text, completed, dueDate, frequency } = req.body;
  try {
    const updatedData = {};
    if (text !== undefined) updatedData.text = text;
    if (completed !== undefined) updatedData.completed = completed;
    if (dueDate !== undefined) updatedData.dueDate = dueDate;
    if (frequency !== undefined) updatedData.frequency = frequency;

    const updatedTask = await Task.updateTask(req.params.id, req.oidc.user.sub, updatedData);
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