document.getElementById('login-btn').addEventListener('click', () => {
  window.location.href = '/login';
});

document.getElementById('logout-btn').addEventListener('click', () => {
  window.location.href = '/logout';
});

window.onload = () => {
  fetch('/user')
    .then(response => response.json())
    .then(user => {
      if (user) {
        document.getElementById('login-btn').style.display = 'none';
        document.getElementById('logout-btn').style.display = 'block';
        document.getElementById('userName').textContent = user.name;
        document.getElementById('userProfilePicture').src = user.picture;
        document.getElementById('userProfilePicture').style.display = 'block';
        // Ensure tasks are loaded for any authenticated user
        loadTasks();
      } else {
        document.getElementById('login-btn').style.display = 'block';
        document.getElementById('logout-btn').style.display = 'none';
        document.getElementById('userName').textContent = '';
        document.getElementById('userProfilePicture').style.display = 'none';
      }
    });
};

const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:3000";
const client = new MongoClient(uri);

async function main() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    const db = client.db("Tamadoro");
    const collection = db.collection("users");

    // Add a user
    const user = {
      userID: new ObjectId(),
      email: "example@example.com",
      password: "hashed_password",
      name: "John Doe",
    };
    const result = await collection.insertOne(user);
    console.log("User added:", result.insertedId);

    // Find a user by email
    const foundUser = await collection.findOne({
      email: "example@example.com",
    });
    console.log("User found:", foundUser);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

main();


function loadTasks() {
  fetch('/tasks')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      return response.json();
    })
    .then(tasks => {
      const taskList = document.getElementById('task-list');
      taskList.innerHTML = '';
      tasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.textContent = `${task.text} - Due: ${task.dueDate || 'No due date'}`;
        taskList.appendChild(taskItem);
      });
    })
    .catch(error => {
      console.error(error);
      alert('Error loading tasks');
    });
}

function openModal() {
  document.getElementById('task-modal').style.display = 'block';
}

function closeModal() {
  document.getElementById('task-modal').style.display = 'none';
}

function submitTask() {
  const taskText = document.getElementById('task-input').value;
  fetch('/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text: taskText }),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to add task');
      }
      return response.json();
    })
    .then(task => {
      const taskList = document.getElementById('task-list');
      const taskItem = document.createElement('li');
      taskItem.textContent = task.text;
      taskList.appendChild(taskItem);
      document.getElementById('task-input').value = '';
      closeModal();
    })
    .catch(error => {
      console.error(error);
      alert('Error adding task');
    });
}