const express = require('express');
const { auth } = require('express-openid-connect');
const mongoose = require('mongoose');
const Task = require('./models/Task'); // Updated path
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001; // Change the port number to 3001

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
  authorizationParams: {
    // Add the scope to include profile and email
    scope: 'openid profile email',
  },
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB using Mongoose
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// API Routes

// Route to fetch user information
app.get('/user', (req, res) => {
  if (req.oidc.isAuthenticated()) {
    res.json(req.oidc.user);
  } else {
    res.json(null);
  }
});

// Fetch tasks for the logged-in user
app.get('/tasks', async (req, res) => {
  if (!req.oidc.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const tasks = await Task.find({ userId: req.oidc.user.sub });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a new task for the logged-in user
app.post('/tasks', async (req, res) => {
  if (!req.oidc.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const task = new Task({
      userId: req.oidc.user.sub,
      text: req.body.text,
      completed: false,
    });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a task for the logged-in user
app.delete('/tasks/:id', async (req, res) => {
  if (!req.oidc.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const result = await Task.deleteOne({ _id: req.params.id, userId: req.oidc.user.sub });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve static files **after** API routes
app.use(express.static('public'));

// Fallback route for undefined endpoints
app.use((req, res) => {
  res.status(404).send('404: Page not found');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});