const express = require('express');
const { auth } = require('express-openid-connect');
const mongoose = require('mongoose');
const Task = require('./models/Task'); // Ensure this path is correct
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// Serve static files from the public directory
app.use(express.static('public'));
app.use(express.json());

// Connect to MongoDB using Mongoose
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Fetch tasks for the logged-in user
app.get('/tasks', async (req, res) => {
  if (!req.oidc.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const tasks = await Task.find({ userId: req.oidc.user.sub });
  res.json(tasks);
});

// Add a new task for the logged-in user
app.post('/tasks', async (req, res) => {
  if (!req.oidc.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const task = new Task({
    userId: req.oidc.user.sub,
    text: req.body.text,
    completed: false,
  });
  await task.save();
  res.status(201).json(task);
});

// Delete a task for the logged-in user
app.delete('/tasks/:id', async (req, res) => {
  if (!req.oidc.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const result = await Task.deleteOne({ _id: req.params.id, userId: req.oidc.user.sub });
  res.json(result);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});