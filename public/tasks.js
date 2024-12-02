// Opening Task section JavaScript

// Variables to store tasks
let dailyTasks = [
    { id: 1, text: "Task One", frequency: "daily" }
];
let tasks = [
    { id: 1, text: "Task One", dueDate: "2024-11-01" }
];

// Track if the modal is for a daily or due date task
let isDailyTask = true;

// Show the selected section
function showSection(section) {
    document.getElementById("daily-section").style.display = section === 'daily' ? 'block' : 'none';
    document.getElementById("tasks-section").style.display = section === 'tasks' ? 'block' : 'none';
    updateTab(section);
}

function updateTab(section) {
    const dailyTab = document.getElementById("daily-tab");
    const taskTab = document.getElementById("task-tab");

    if (section === 'daily') {
        dailyTab.classList.add('clicked');
        taskTab.classList.remove('clicked');
    } else if (section === 'tasks') {
        taskTab.classList.add('clicked');
        dailyTab.classList.remove('clicked');
    }
}

// Load daily tasks into the daily tasks list
function loadDailyTasks() {
    const dailyList = document.getElementById("daily-ttasks-list");
    dailyList.innerHTML = ""; // Clear existing tasks

    dailyTasks.forEach(task => {
        const li = document.createElement("li");
        const p = document.createElement("p");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = `item ${task.id}`;

        p.textContent = task.text;
        li.appendChild(checkbox);
        li.appendChild(p);

        dailyList.appendChild(li);
    });
}

// Load tasks with due dates into the tasks list
function loadTasks() {
    const tasksList = document.getElementById("tasks-list");
    tasksList.innerHTML = ""; // Clear existing tasks

    tasks.forEach(task => {
        const li = document.createElement("li");
        li.textContent = `${task.text} - Due: ${task.dueDate}`;
        tasksList.appendChild(li);
    });
}

// Open the modal for adding a task
function openModal(taskType) {
    const modal = document.getElementById("task-modal");
    modal.style.display = "block";
    
    isDailyTask = taskType === 'daily';
    document.getElementById("modal-title").textContent = isDailyTask ? "Add Daily Task" : "Add Task";
    
    // Show or hide the date input based on task type
    document.getElementById("task-date-input").style.display = isDailyTask ? "none" : "block";
}

// Close the modal
function closeModal() {
    const modal = document.getElementById("task-modal");
    modal.style.display = "none";
    clearModalInputs();
}

// Clear inputs in the modal
function clearModalInputs() {
    document.getElementById("task-input").value = "";
    document.getElementById("task-date-input").value = "";
}

// Load tasks from the server
function loadTasksFromServer() {
    fetch('/tasks')
        .then(response => response.json())
        .then(data => {
            dailyTasks = data.filter(task => task.frequency === 'daily');
            tasks = data.filter(task => task.dueDate);
            loadDailyTasks();
            loadTasks();
        });
}

// Save task to the server
function saveTaskToServer(task) {
    fetch('/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
    }).then(response => response.json())
      .then(data => {
          if (!data.success) {
              alert('Failed to save task');
          }
      });
}

// Delete task from the server
function deleteTaskFromServer(taskId) {
    fetch(`/tasks/${taskId}`, {
        method: 'DELETE'
    }).then(response => response.json())
      .then(data => {
          if (!data.success) {
              alert('Failed to delete task');
          }
      });
}

// Add a new task from the modal
function submitTask(index = null) {
    const taskInput = document.getElementById("task-input").value.trim();
    const dateInput = document.getElementById("task-date-input").value;

    if (isDailyTask) {
        if (taskInput) {
            const task = index !== null ? dailyTasks[index] : { id: Date.now(), frequency: "daily" };
            task.text = taskInput;
            if (index === null) dailyTasks.push(task);
            loadDailyTasks();
            saveTaskToServer(task);
        } else {
            alert("Please enter a daily task name.");
            return;
        }
    } else {
        if (taskInput && dateInput) {
            const task = index !== null ? tasks[index] : { id: Date.now() };
            task.text = taskInput;
            task.dueDate = dateInput;
            if (index === null) tasks.push(task);
            loadTasks();
            saveTaskToServer(task);
        } else {
            alert("Please enter a task name and due date.");
            return;
        }
    }
    
    closeModal(); // Close the modal after adding/editing the task
}

// Reset daily tasks
function resetDailyTasks() {
    alert("Daily tasks have been reset!");
    dailyTasks = []; // Clear all daily tasks
    loadDailyTasks(); // Reload the daily tasks
}

// Close the modal if the user clicks outside of it
window.onclick = function(event) {
    const modal = document.getElementById("task-modal");
    if (event.target === modal) {
        closeModal();
    }
}

// Initial load of tasks when the page is ready
document.addEventListener("DOMContentLoaded", function() {
    loadTasksFromServer();
});

document.addEventListener('DOMContentLoaded', function() {
  const dailyTasks = [];
  const scheduledTasks = [];

  const dailyTasksTab = document.getElementById('daily-tasks-tab');
  const scheduledTasksTab = document.getElementById('scheduled-tasks-tab');
  const dailyTasksContent = document.getElementById('daily-tasks-content');
  const scheduledTasksContent = document.getElementById('scheduled-tasks-content');

  dailyTasksTab.addEventListener('click', function() {
    dailyTasksContent.style.display = 'block';
    scheduledTasksContent.style.display = 'none';
    dailyTasksTab.classList.add('active-tab');
    scheduledTasksTab.classList.remove('active-tab');
  });

  scheduledTasksTab.addEventListener('click', function() {
    dailyTasksContent.style.display = 'none';
    scheduledTasksContent.style.display = 'block';
    scheduledTasksTab.classList.add('active-tab');
    dailyTasksTab.classList.remove('active-tab');
  });

  const taskModal = document.getElementById('task-modal');
  const modalTitle = document.getElementById('modal-title');
  const taskNameInput = document.getElementById('task-name-input');
  const taskDateInput = document.getElementById('task-date-input');
  const saveTaskButton = document.getElementById('save-task-button');
  const closeButton = document.querySelector('.close-button');

  let currentTaskType = 'daily';
  let editingIndex = null;

  document.getElementById('add-daily-task-button').addEventListener('click', function() {
    currentTaskType = 'daily';
    modalTitle.textContent = 'Add Daily Task';
    taskDateInput.style.display = 'none';
    taskModal.style.display = 'block';
  });

  document.getElementById('add-scheduled-task-button').addEventListener('click', function() {
    currentTaskType = 'scheduled';
    modalTitle.textContent = 'Add Scheduled Task';
    taskDateInput.style.display = 'block';
    taskModal.style.display = 'block';
  });

  closeButton.addEventListener('click', function() {
    taskModal.style.display = 'none';
    editingIndex = null;
  });

  saveTaskButton.addEventListener('click', function() {
    const taskName = taskNameInput.value.trim();
    if (taskName === '') {
      alert('Please enter a task name.');
      return;
    }

    if (editingIndex !== null) {
      // Update existing task
      if (currentTaskType === 'daily') {
        dailyTasks[editingIndex].name = taskName;
        renderDailyTasks();
      } else {
        const taskDate = taskDateInput.value;
        if (taskDate === '') {
          alert('Please select a date.');
          return;
        }
        scheduledTasks[editingIndex].name = taskName;
        scheduledTasks[editingIndex].date = taskDate;
        renderScheduledTasks();
      }
      editingIndex = null;
    } else {
      // ...existing code for adding new tasks...
      if (currentTaskType === 'daily') {
        dailyTasks.push({ name: taskName });
        renderDailyTasks();
      } else {
        const taskDate = taskDateInput.value;
        if (taskDate === '') {
          alert('Please select a date.');
          return;
        }
        scheduledTasks.push({ name: taskName, date: taskDate });
        renderScheduledTasks();
      }
    }

    taskNameInput.value = '';
    taskDateInput.value = '';
    taskModal.style.display = 'none';
  });

  function renderDailyTasks() {
    const dailyTasksList = document.getElementById('daily-tasks-list');
    dailyTasksList.innerHTML = '';
    dailyTasks.forEach(function(task, index) {
      const li = document.createElement('li');
      li.textContent = task.name;

      const buttonContainer = document.createElement('div');

      const editButton = document.createElement('button');
      editButton.textContent = 'Edit';
      editButton.onclick = function() {
        editTask(index, 'daily');
      };

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.onclick = function() {
        deleteTask(index, 'daily');
      };

      buttonContainer.appendChild(editButton);
      buttonContainer.appendChild(deleteButton);
      li.appendChild(buttonContainer);
      dailyTasksList.appendChild(li);
    });
  }

  function renderScheduledTasks() {
    const scheduledTasksList = document.getElementById('scheduled-tasks-list');
    scheduledTasksList.innerHTML = '';
    scheduledTasks.forEach(function(task, index) {
      const li = document.createElement('li');
      li.textContent = `${task.name} - ${task.date}`;

      const buttonContainer = document.createElement('div');

      const editButton = document.createElement('button');
      editButton.textContent = 'Edit';
      editButton.onclick = function() {
        editTask(index, 'scheduled');
      };

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.onclick = function() {
        deleteTask(index, 'scheduled');
      };

      buttonContainer.appendChild(editButton);
      buttonContainer.appendChild(deleteButton);
      li.appendChild(buttonContainer);
      scheduledTasksList.appendChild(li);
    });
  }

  function editTask(index, type) {
    currentTaskType = type;
    editingIndex = index;

    const task = type === 'daily' ? dailyTasks[index] : scheduledTasks[index];

    taskNameInput.value = task.name;
    if (type === 'scheduled') {
      taskDateInput.value = task.date;
      taskDateInput.style.display = 'block';
    } else {
      taskDateInput.style.display = 'none';
    }

    modalTitle.textContent = 'Edit Task';
    taskModal.style.display = 'block';
  }

  function deleteTask(index, type) {
    if (type === 'daily') {
      dailyTasks.splice(index, 1);
      renderDailyTasks();
    } else {
      scheduledTasks.splice(index, 1);
      renderScheduledTasks();
    }
  }

  // ...existing code...
});

// Edit an existing task
function editTask(index, type) {
    const task = type === 'daily' ? dailyTasks[index] : tasks[index];
    document.getElementById("task-input").value = task.text;
    if (type === 'daily') {
        document.getElementById("task-date-input").style.display = 'none';
    } else {
        document.getElementById("task-date-input").value = task.dueDate;
        document.getElementById("task-date-input").style.display = 'block';
    }
    isDailyTask = type === 'daily';
    document.getElementById("modal-title").textContent = isDailyTask ? "Edit Daily Task" : "Edit Task";
    document.getElementById("task-modal").style.display = "block";
    document.getElementById("save-task-button").onclick = function() {
        submitTask(index);
    };
}

// Delete an existing task
function deleteTask(index, type) {
    const taskId = type === 'daily' ? dailyTasks[index].id : tasks[index].id;
    if (type === 'daily') {
        dailyTasks.splice(index, 1);
        loadDailyTasks();
    } else {
        tasks.splice(index, 1);
        loadTasks();
    }
    deleteTaskFromServer(taskId);
}

// Closing Task section JavaScript