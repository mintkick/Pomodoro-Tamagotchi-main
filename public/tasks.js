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
    const dailyTab = document.getElementById("daily-tasks-tab");
    const taskTab = document.getElementById("scheduled-tasks-tab");

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
    const dailyList = document.getElementById("daily-tasks-list");
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
async function loadTasks() {
  console.log("Starting loadTasks...");
  const tasksList = document.getElementById("scheduled-tasks-list");

  if (!tasksList) {
    console.error('Element with id "scheduled-tasks-list" not found.');
    alert("Error: Task list container not found.");
    return;
  }

  tasksList.innerHTML = ""; // Clear existing tasks

  try {
    const response = await fetch("/tasks");
    if (!response.ok) {
      throw new Error("Failed to fetch tasks");
    }

    const tasks = await response.json();
    tasks.forEach((task) => {
      const li = document.createElement("li");
      li.textContent = `${task.text} - Due: ${task.dueDate}`;
      tasksList.appendChild(li); // Append task to the list
    });
  } catch (error) {
    console.error(error);
    alert("Error loading tasks");
  }
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

// Add a new task from the modal
function renderSubmittedTask(index = null) {
    const taskInput = document.getElementById("task-input").value.trim();
    const dateInput = document.getElementById("task-date-input").value;

    if (isDailyTask) {
        if (taskInput) {
            if (index !== null) {
                dailyTasks[index].text = taskInput;
            } else {
                dailyTasks.push({ id: Date.now(), text: taskInput, frequency: "daily" });
                console.log("Daily tasks:", dailyTasks);
            }
            renderDailyTasks();
        } else {
            alert("Please enter a daily task name.");
            return;
        }
    } else {
        if (taskInput && dateInput) {
            if (index !== null) {
                tasks[index].text = taskInput;
                tasks[index].dueDate = dateInput;
            } else {
                tasks.push({ id: Date.now(), text: taskInput, dueDate: dateInput });
            }
            loadTasks();
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
// document.addEventListener("DOMContentLoaded", function() {
//     loadDailyTasks();
//     loadTasks();
// });

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
    dailyTasksTab.classList.add('clicked');
    scheduledTasksTab.classList.remove('clicked');
  });

  scheduledTasksTab.addEventListener('click', function() {
    dailyTasksContent.style.display = 'none';
    scheduledTasksContent.style.display = 'block';
    scheduledTasksTab.classList.add('clicked');
    dailyTasksTab.classList.remove('clicked');
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
        newTask = {"text": taskName}
        renderDailyTasks();
        updateTask(newTask);
      } else {
        const taskDate = taskDateInput.value;
        console.log(taskDate)
        if (taskDate === '') {
          alert('Please select a date.');
          return;
        }
        scheduledTasks[editingIndex].name = taskName;
        scheduledTasks[editingIndex].date = taskDate;
        newTask = {text: taskName, dueDate: taskDate}
        renderScheduledTasks();
        updateTask(newTask);
      }
      editingIndex = null;
    } else {
      // ...existing code for adding new tasks...
      if (currentTaskType === 'daily') {
        const task = { text: taskName, date: null }
        dailyTasks.push(task);
        renderDailyTasks();
        submitTask(task);
      } else {
        const taskDate = taskDateInput.value;
        if (taskDate === '') {
          alert('Please select a date.');
          return;
        }
        const task = { text: taskName, date: taskDate }
        scheduledTasks.push(task);
        renderScheduledTasks();
        submitTask(task)
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
        deleteTaskOnScreen(index, 'daily');
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
        deleteTaskOnScreen(index, 'scheduled');
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

  function deleteTaskOnScreen(index, type) {
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
// function editTask(index, type) {
//     const task = type === 'daily' ? dailyTasks[index] : tasks[index];
//     document.getElementById("task-input").value = task.text || task.name;
//     if (type === 'daily') {
//         document.getElementById("task-date-input").style.display = 'none';
//     } else {
//         document.getElementById("task-date-input").value = task.dueDate || task.date;
//         document.getElementById("task-date-input").style.display = 'block';
//     }
//     isDailyTask = type === 'daily';
//     document.getElementById("modal-title").textContent = isDailyTask ? "Edit Daily Task" : "Edit Scheduled Task";
//     document.getElementById("task-modal").style.display = "block";
//     document.getElementById("save-task-button").onclick = function() {
//         submitTask(index);
//     };
// }

// Delete an existing task
// function deleteTask(index, type) {
//     if (type === 'daily') {
//         dailyTasks.splice(index, 1);
//         loadDailyTasks();
//     } else {
//         tasks.splice(index, 1);
//         loadTasks();
//     }
// }

// Render Daily Tasks with Edit and Delete options
function renderDailyTasks() {
    const dailyTasksList = document.getElementById('daily-tasks-list');
    dailyTasksList.innerHTML = '';
    dailyTasks.forEach(function(task, index) {
        const li = document.createElement('li');
        li.textContent = task.text;

        const buttonContainer = document.createElement('div');

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.onclick = function() {
            editTask(index, 'daily');
        };

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = function() {
            deleteTaskOnScreen(index, 'daily');
        };

        buttonContainer.appendChild(editButton);
        buttonContainer.appendChild(deleteButton);
        li.appendChild(buttonContainer);
        dailyTasksList.appendChild(li);
    });
}

// Render Scheduled Tasks with Edit and Delete options
function renderScheduledTasks() {
    const scheduledTasksList = document.getElementById('scheduled-tasks-list');
    scheduledTasksList.innerHTML = '';
    tasks.forEach(function(task, index) {
        const li = document.createElement('li');
        li.textContent = `${task.text} - Due: ${task.dueDate}`;

        const buttonContainer = document.createElement('div');

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.onclick = function() {
            editTask(index, 'scheduled');
        };

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = function() {
            deleteTaskOnScreen(index, 'scheduled');
        };

        buttonContainer.appendChild(editButton);
        buttonContainer.appendChild(deleteButton);
        li.appendChild(buttonContainer);
        scheduledTasksList.appendChild(li);
    });
}

// Closing Task section JavaScript

function deleteTask(id) {
  fetch(`/tasks/${id}`, {
    method: 'DELETE',
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
      return response.json();
    })
    .then(() => {
      loadTasks(); // Reload tasks after deletion
    })
    .catch(error => {
      console.error(error);
      alert('Error deleting task');
    });
}

async function updateTask(id, updatedData) {
  await fetch(`/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedData),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to update task');
      }
      return response.json();
    })
    .then(() => {
      loadTasks(); // Reload tasks after update
    })
    .catch(error => {
      console.error(error);
      alert('Error updating task');
    });
}



function openModal() {
  document.getElementById("task-modal").style.display = "block";
}

function closeModal() {
  document.getElementById("task-modal").style.display = "none";
}

function submitTask(task) {
  // const taskText = document.getElementById("task-input").value;

  fetch("/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to add task");
      }
      return response.json();
    })
    .then((task) => {
      const taskList = document.getElementById("scheduled-task-list"); // fix later
      const taskItem = document.createElement("li");
      taskItem.textContent = task.text;
      console.log(taskItem);
      taskList.appendChild(taskItem);
      document.getElementById("task-input").value = "";
      closeModal();
    })
    .catch((error) => {
      console.error(error);
      alert("Error adding task");
    });
}

// ...existing code...