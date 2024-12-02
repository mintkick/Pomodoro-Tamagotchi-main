const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const { auth, requiresAuth } = require('express-openid-connect');
const Task = require('./models/Task'); // Import Task model
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected! ✌️'))
  .catch((err) => console.log(err));

// Define Auth0 Configuration
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL
};

// Enable CORS for all routes
app.use(cors());

// Initialize Auth0 with authConfig
app.use(auth(config));

// Middleware to parse incoming JSON requests
app.use(express.json());

// Route to check authentication status
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

// Login route (Auth0 handles this automatically but we can customize)
app.get('/login', (req, res) => {
  res.oidc.login({
    returnTo: '/',
    authorizationParams: {
      prompt: 'login'
    }
  });
});

// Logout route
app.get('/logout', (req, res) => {
  res.oidc.logout({
    returnTo: process.env.BASE_URL
  });
});

// Get user profile (protected route)
app.get('/profile', requiresAuth(), (req, res) => {
  res.json(req.oidc.user);
});

// Check authentication status
app.get('/auth-status', (req, res) => {
  res.json({
    isAuthenticated: req.oidc.isAuthenticated(),
    user: req.oidc.user
  });
});

// API Routes (Protected)
app.get('/tasks', requiresAuth(), async (req, res) => {
  const userId = req.oidc.user.sub;

  try {
    const tasks = await Task.find({ userId });
    res.json(tasks);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/tasks', requiresAuth(), async (req, res) => {
  const { text, dueDate } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Task text is required' });
  }

  try {
    const newTask = {
      userId: req.oidc.user.sub,
      text,
      dueDate,
      completed: false,
    };
    const task = new Task(newTask);
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/tasks/:id', requiresAuth(), async (req, res) => {
  const userId = req.oidc.user.sub;
  const taskId = req.params.id;

  try {
    const result = await Task.deleteOne({ _id: taskId, userId });
    res.json(result);
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve static files after API routes
app.use(express.static('public'));

// Fallback route for undefined endpoints
app.use((req, res) => {
  res.status(404).send('404: Page not found');
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));