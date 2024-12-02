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
        loadTasks();
      } else {
        document.getElementById('login-btn').style.display = 'block';
        document.getElementById('logout-btn').style.display = 'none';
        document.getElementById('userName').textContent = '';
        document.getElementById('userProfilePicture').style.display = 'none';
      }
    });
};

function loadTasks() {
  fetch('/tasks')
    .then(response => response.json())
    .then(tasks => {
      const taskList = document.getElementById('task-list');
      taskList.innerHTML = '';
      tasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.textContent = task.text;
        taskList.appendChild(taskItem);
      });
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
    .then(response => response.json())
    .then(task => {
      const taskList = document.getElementById('task-list');
      const taskItem = document.createElement('li');
      taskItem.textContent = task.text;
      taskList.appendChild(taskItem);
      document.getElementById('task-input').value = '';
      closeModal();
    });
}