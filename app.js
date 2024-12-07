const express = require('express');
const { auth } = require('express-openid-connect');
const Task = require('./models/task.service'); // Import Task model
const user = require('./models/user.service')
const pet = require('./models/pet.service')
const db = require('./database'); // Import database.js
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
app.use(cookieParser());
const PORT = process.env.PORT || 3000;

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

// Serve static files from the public directory
app.use(express.static('public'));

app.use(express.json()); // Add JSON parsing middleware

db.connectDB(); // Initialize database connection

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

app.post('/user', async(req, res) => {
  const userData = await user.saveUserData(req.body)
  res.cookie("userId", userData.userID);

  res.json(userData);
})


// CRUD Routes for Tasks
app.get('/tasks', async (req, res) => {
  try {
    const userId = req.cookies.userId;
    console.log(userId)
    const tasks = await Task.getTasks(userId); // Gets tasks from database
    res.json(tasks);
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Server error in getting Task' });
  }
});

app.post('/tasks', async (req, res) => {
  const { text, dueDate, type } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Task text is required' });
  }
  try {
    const newTask = {
      userId: req.cookies.userId,
      text,
      dueDate,
      type, // 'daily' or 'scheduled'
      completed: false,
    };
    const savedTask = await Task.createTask(newTask);
    res.status(201).json(savedTask);
    console.log(savedTask);
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
    res.status(500).json({ error: 'Server error', err });
  }
});

app.put('/tasks/:id', async (req, res) => {
  const { text, completed, dueDate, type } = req.body;
  try {
    const updatedData = {id};
    if (text !== undefined) updatedData.text = text;
    if (completed !== undefined) updatedData.completed = completed;
    if (dueDate !== undefined) updatedData.dueDate = dueDate;
    if (type !== undefined) updatedData.type = type;

    const updatedTask = await Task.updateTask(req.params.id, updatedData);
    if (!updatedTask.value) {
      return res.status(404).json({ error: 'Task not found', updatedTask });
    }
    res.json(updatedTask.value);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});



app.get('/pet', async (req, res) => {
  try {
    const userId = req.cookies.userId;
    console.log(userId)
    const tasks = await pet.getPet(userId); // Gets tasks from database
    res.json(tasks);
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Server error in getting Task' });
  }
});

app.post('/pet', async (req, res) => {
  const { name, satiated, food } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Task text is required' });
  }
  try {
    const newPet = {
      userId: req.cookies.userId,
      name,
      satiated,
      food
    };
    const savedPet = await pet.createPet(newTask);
    res.status(201).json(savedTask);
    console.log(savedTask);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/pet/:id', async (req, res) => {
  const {name, satiated, food  } = req.body;
  try {
    const updatedData = {id};
    if (name !== undefined) updatedData.name = name;
    if (satiated !== undefined) updatedData.satiated = satiated;
    if (food !== undefined) updatedData.food = food;

    const updatedTask = await pet.updatePet(req.params.id, updatedData);
    if (!updatedTask.value) {
      return res.status(404).json({ error: 'Pet not found', updatedTask });
    }
    res.json(updatedTask.value);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});






app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// This version works with the following changes:
// - The Task model is imported from models/task.service.js
// - The Task model is used to interact with the database
// - The user ID is stored in a cookie
// - The user ID is used to filter tasks by user
