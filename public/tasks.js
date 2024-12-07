// Opening Task section JavaScript

// Variables to store tasks
let allTasks = []; // Add this line at the top
let currentTaskType = 'daily'; // Add this as a global variable

// Track if the modal is for a daily or due date task
let isDailyTask = true;

// Show the selected section
// function showSection(section) {
//     const dailyContent = document.getElementById("daily-tasks-content");
//     const tasksContent = document.getElementById("scheduled-tasks-content");
    
//     if (section === 'daily') {
//         dailyContent.style.display = 'block';
//         tasksContent.style.display = 'none';
//         renderDailyTasks();
//     } else if (section === 'tasks') {
//         dailyContent.style.display = 'none';
//         tasksContent.style.display = 'block';
//         renderScheduledTasks();
//     }
//     updateTab(section);
// }

// function updateTab(section) {
//     const dailyTab = document.getElementById("daily-tasks-tab");
//     const taskTab = document.getElementById("scheduled-tasks-tab");

//     if (section === 'daily') {
//         dailyTab.classList.add('clicked');
//         taskTab.classList.remove('clicked');
//     } else if (section === 'tasks') {
//         taskTab.classList.add('clicked');
//         dailyTab.classList.remove('clicked');
//     }
// }

// Load daily tasks into the daily tasks list
// function loadDailyTasks() {
//     const dailyList = document.getElementById("daily-tasks-list");
//     dailyList.innerHTML = ""; // Clear existing tasks

//     dailyTasks.forEach(task => {
//         const li = document.createElement("li");
//         const p = document.createElement("p");

//         const checkbox = document.createElement("input");
//         checkbox.type = "checkbox";
//         checkbox.id = `item ${task.id}`;

//         p.textContent = task.text;
//         li.appendChild(checkbox);
//         li.appendChild(p);

//         dailyList.appendChild(li);
//     });
// }

// Load tasks with due dates into the tasks list
// async function loadTasks() {
//   try {
//     const response = await fetch("/tasks");
//     if (!response.ok) {
//       throw new Error("Failed to fetch tasks");
//     }
//     allTasks = await response.json();
//     renderDailyTasks();
//     renderScheduledTasks();
//   } catch (error) {
//     console.error(error);
//     alert("Error loading tasks");
//   }
// }

/**
 * Opens the task modal with appropriate settings based on task type
 * @param {string} taskType - Either 'daily' or 'scheduled'
 */
function openModal(taskType) {
    const modal = document.getElementById("task-modal");
    modal.style.display = "block";
    
    // Explicitly set task type when modal opens to ensure correct type is used
    currentTaskType = taskType;
    isDailyTask = taskType === 'daily';
    document.getElementById("modal-title").textContent = isDailyTask ? "Add Daily Task" : "Add Task";
    
    // Show date input only for scheduled tasks
    document.getElementById("task-date-input").style.display = isDailyTask ? "none" : "block";
}

// Close the modal
// function closeModal() {
//     const modal = document.getElementById("task-modal");
//     modal.style.display = "none";
//     clearModalInputs();
}

// Clear inputs in the modal
// function clearModalInputs() {
//     document.getElementById("task-input").value = "";
//     document.getElementById("task-date-input").value = "";
// }

/**
 * Handles the submission of a new task to the server
 * @param {Object} task - Task object containing text, type, and optional dueDate
 * @returns {Promise<void>}
 */
async function submitTask(task) {
    try {
        const response = await fetch("/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(task),
        });

        if (!response.ok) {
            throw new Error("Failed to add task");
        }

        const newTask = await response.json();
        allTasks.push(newTask);
        updateUIAfterChange();
        closeModal();
    } catch (error) {
        console.error('Error submitting task:', error);
        alert("Error adding task");
    }
}

/**
 * Handles editing of an existing task
 * @param {string} taskId - MongoDB _id of the task
 * @param {string} type - Either 'daily' or 'scheduled'
 * @returns {Promise<void>}
 */
async function editTask(taskId, type) {
  // Find the task in allTasks array
  const taskIndex = allTasks.findIndex((t) => t.id === taskId);
  if (taskIndex === -1) return;

  // Set up the modal for editing
  currentTaskType = type;
  document.getElementById("task-name-input").value = allTasks[taskIndex].text;
  document.getElementById("task-date-input").value =
    allTasks[taskIndex].dueDate || "";
  document.getElementById("task-date-input").style.display =
    type === "daily" ? "none" : "block";
  document.getElementById("modal-title").textContent = `Edit ${
    type === "daily" ? "Daily" : "Scheduled"
  } Task`;

  // Update the save button to handle edit
  const saveButton = document.getElementById("save-task-button");
  saveButton.onclick = async () => {
    const updatedData = {
      id: taskId, // Ensure the ID remains the same
      text: document.getElementById("task-name-input").value.trim(),
      type: type,
      dueDate:
        type === "scheduled"
          ? document.getElementById("task-date-input").value
          : null,
    };
    try{
      updateTask(taskId, updatedData);
    } catch (error) {
        console.error("Error updating task:", error);
        alert("Error updating task2");
      }
  };

  // Show the modal
  document.getElementById("task-modal").style.display = "block";
}

/**
 * Updates an existing task in the database
 * @param {string} id - MongoDB _id of the task
 * @param {Object} updatedData - New task data (text, type, dueDate)
 * @returns {Promise<Object>} - The updated task from the server
 */
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
      console.log("attempt to load tasks")
      loadTasks(); // Reload tasks after update
      console.log("tasks loaded")
    })
    .catch(error => {
      console.error(error);
      alert('Error updating task');
    });
}

/**
 * Deletes a task from the database
 * @param {string} taskId - MongoDB _id of the task
 * @param {string} type - Either 'daily' or 'scheduled'
 * @returns {Promise<void>}
 */
async function deleteTask(taskId, type) {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
        const response = await fetch(`/tasks/${taskId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to delete task');
        
        // Update local data
       allTasks = allTasks.filter((task) => task.id !== taskId);
        
        // Re-render the appropriate list
        if (type === 'daily') {
            renderDailyTasks();
        } else {
            renderScheduledTasks();
        }
    } catch (error) {
        console.error('Error deleting task:', error);
        alert('Error deleting task');
    }
}

/**
 * Renders the list of daily tasks in the UI
 * Filters tasks by type='daily' and creates HTML elements
 */
function renderDailyTasks() {
    const dailyList = document.getElementById('daily-tasks-list');
    dailyList.innerHTML = '';

    const dailyTasks = allTasks.filter(task => task.type === 'daily');
    
    dailyTasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${task.text}</span>
            <div class="task-buttons">
                <button onclick="editTask('${task.id}', 'daily')">Edit</button>
                <button onclick="deleteTask('${task.id}', 'daily')">Delete</button>
            </div>
        `;
        dailyList.appendChild(li);
    });
}

/**
 * Renders the list of scheduled tasks in the UI
 * Filters tasks by type='scheduled' and creates HTML elements
 * Includes due dates in the display
 */
function renderScheduledTasks() {
    const scheduledList = document.getElementById('scheduled-tasks-list');
    scheduledList.innerHTML = '';

    const scheduledTasks = allTasks.filter(task => task.type === 'scheduled');
    
    scheduledTasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${task.text}${task.dueDate ? ` - Due: ${task.dueDate}` : ''}</span>
            <div class="task-buttons">
                <button onclick="editTask('${task.id}', 'scheduled')">Edit</button>
                <button onclick="deleteTask('${task.id}', 'scheduled')">Delete</button>
            </div>
        `;
        scheduledList.appendChild(li);
    });
}

/**
 * Helper function to update all task lists
 * Called after any task modification (create/update/delete)
 */
function updateUIAfterChange() {
    renderDailyTasks();
    renderScheduledTasks();
}

// Event Listeners

/**
 * Initialize the application when the DOM is ready
 * Sets up event listeners for buttons and tabs
 * Loads initial task data
 */
document.addEventListener('DOMContentLoaded', function() {
    const dailyTasksTab = document.getElementById('daily-tasks-tab');
    const scheduledTasksTab = document.getElementById('scheduled-tasks-tab');
    const taskModal = document.getElementById('task-modal');
    const modalTitle = document.getElementById('modal-title');
    const taskNameInput = document.getElementById('task-name-input');
    const taskDateInput = document.getElementById('task-date-input');
    const saveTaskButton = document.getElementById('save-task-button');
    const closeButton = document.querySelector('.close-button');

    let currentTaskType = 'daily';
    let editingIndex = null;

    // Tab switching logic
    dailyTasksTab.addEventListener('click', () => showSection('daily'));
    scheduledTasksTab.addEventListener('click', () => showSection('tasks'));

    // Add task button handlers
    document.getElementById('add-daily-task-button').addEventListener('click', () => {
        currentTaskType = 'daily';
        editingIndex = null;
        openAddTaskModal();
    });

    document.getElementById('add-scheduled-task-button').addEventListener('click', () => {
        currentTaskType = 'scheduled';
        editingIndex = null;
        openAddTaskModal();
    });

    // function openAddTaskModal() {
    //     modalTitle.textContent = `Add ${currentTaskType === 'daily' ? 'Daily' : 'Scheduled'} Task`;
    //     taskNameInput.value = '';
    //     taskDateInput.value = '';
    //     taskDateInput.style.display = currentTaskType === 'daily' ? 'none' : 'block';
    //     taskModal.style.display = 'block';
    // }

    saveTaskButton.addEventListener('click', async () => {
      
        const taskName = taskNameInput.value.trim();
        const taskDate = taskDateInput.value;

        if (!taskName) {
            alert('Please enter a task name');
            return;
        }

        if (currentTaskType === 'scheduled' && !taskDate) {
            alert('Please select a date for scheduled task');
            return;
        }

        // Fix: Pass the correct task type in the taskData object
        const taskData = {
            text: taskName,
            type: currentTaskType, // This will now be correctly set from openModal
            dueDate: currentTaskType === 'scheduled' ? taskDate : null
        };
        submitTask(taskData);
        loadTasks();
    });

    closeButton.addEventListener('click', () => {
        taskModal.style.display = 'none';
        editingIndex = null;
    });

    // Initial render
    showSection('daily');
    loadTasks(); // Load all tasks when page loads
});

// async function editTask(taskId, type) {
//   // Find the task in allTasks array
//   const taskIndex = allTasks.findIndex((t) => t.id === taskId);
//   if (taskIndex === -1) return;

//   // Set up the modal for editing
//   currentTaskType = type;
//   document.getElementById("task-name-input").value = allTasks[taskIndex].text;
//   document.getElementById("task-date-input").value =
//     allTasks[taskIndex].dueDate || "";
//   document.getElementById("task-date-input").style.display =
//     type === "daily" ? "none" : "block";
//   document.getElementById("modal-title").textContent = `Edit ${
//     type === "daily" ? "Daily" : "Scheduled"
//   } Task`;

//   // Update the save button to handle edit
//   const saveButton = document.getElementById("save-task-button");
//   saveButton.onclick = async () => {
//     const updatedData = {
//       id: taskId, // Ensure the ID remains the same
//       text: document.getElementById("task-name-input").value.trim(),
//       type: type,
//       dueDate:
//         type === "scheduled"
//           ? document.getElementById("task-date-input").value
//           : null,
//     };
//     try{
//       updateTask(taskId, updatedData);
//     } catch (error) {
//         console.error("Error updating task:", error);
//         alert("Error updating task2");
//       }

    // try {
    //   const response = await fetch(`/tasks/${taskId}`, {
    //     method: "PUT",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(updatedData),
    //   });

    //   if (!response.ok) throw new Error("Failed to update task");

    //   // Update local task data
    //   allTasks[taskIndex] = updatedData;

    //   // Re-render the appropriate list
    //   if (type === "daily") {
    //     renderDailyTasks();
    //   } else {
    //     renderScheduledTasks();
    //   }

    //   // Close the modal
    //   closeModal();
    // } catch (error) {
    //   console.error("Error updating task:", error);
    //   alert("Error updating task");
    // }
//   };

//   // Show the modal
//   document.getElementById("task-modal").style.display = "block";
// }


// async function deleteTask(taskId, type) {
//     if (!confirm('Are you sure you want to delete this task?')) return;

//     try {
//         const response = await fetch(`/tasks/${taskId}`, {
//             method: 'DELETE'
//         });
        
//         if (!response.ok) throw new Error('Failed to delete task');
        
//         // Update local data
//        allTasks = allTasks.filter((task) => task.id !== taskId);
        
//         // Re-render the appropriate list
//         if (type === 'daily') {
//             renderDailyTasks();
//         } else {
//             renderScheduledTasks();
//         }
//     } catch (error) {
//         console.error('Error deleting task:', error);
//         alert('Error deleting task');
//     }
// }

// Update the renderDailyTasks and renderScheduledTasks functions to use _id
function renderDailyTasks() {
    const dailyList = document.getElementById('daily-tasks-list');
    dailyList.innerHTML = '';

    // const dailyTasks = allTasks.filter(task => task.type === 'daily');
    
    dailyTasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${task.text}</span>
            <div class="task-buttons">
                <button onclick="editTask('${task._id}', 'daily')">Edit</button>
                <button onclick="deleteTask('${task._id}', 'daily')">Delete</button>
            </div>
        `;
        dailyList.appendChild(li);
    });
}

function renderScheduledTasks() {
    const scheduledList = document.getElementById('scheduled-tasks-list');
    scheduledList.innerHTML = '';

    const scheduledTasks = allTasks.filter(task => task.type === 'scheduled');
    
    scheduledTasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${task.text}${task.dueDate ? ` - Due: ${task.dueDate}` : ''}</span>
            <div class="task-buttons">
                <button onclick="editTask('${task._id}', 'scheduled')">Edit</button>
                <button onclick="deleteTask('${task._id}', 'scheduled')">Delete</button>
            </div>
        `;
        scheduledList.appendChild(li);
    });
}

// Closing Task section JavaScript

// async function updateTask(id, updatedData) {
//   await fetch(`/tasks/${id}`, {
//     method: 'PUT',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//       body: JSON.stringify(updatedData),
//   })
//     .then(response => {
//       if (!response.ok) {
//         throw new Error('Failed to update task');
//       }
//       return response.json();
    
//     })
//     .then(() => {
//       console.log("attempt to load tasks")
//       loadTasks(); // Reload tasks after update
//       console.log("tasks loaded")
//     })
//     .catch(error => {
//       console.error(error);
//       alert('Error updating task');
//     });
// }

function openModal() {
  document.getElementById("task-modal").style.display = "block";
}

function closeModal() {
  document.getElementById("task-modal").style.display = "none";
}

// function submitTask(task) {
//   // Add type to the task object
//   const taskWithType = {
//     ...task,
//     type: currentTaskType // 'daily' or 'scheduled'
//   };

//   fetch("/tasks", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(taskWithType),
//   })
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error("Failed to add task");
//       }
//       return response.json();
//     })
//     .then((newTask) => {
//       allTasks.push(newTask);
//       if (newTask.type === 'daily') {
//         renderDailyTasks();
//       } else {
//         renderScheduledTasks();
//       }
//       closeModal();
//     })
//     .catch((error) => {
//       console.error(error);
//       alert("Error adding task");
//     });
// }

// Update render functions to use _id consistently
function renderDailyTasks() {
    const dailyList = document.getElementById('daily-tasks-list');
    dailyList.innerHTML = '';

    const dailyTasks = allTasks.filter(task => task.type === 'daily');
    
    dailyTasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${task.text}</span>
            <div class="task-buttons">
                <button onclick="editTask('${task._id}', 'daily')">Edit</button>
                <button onclick="deleteTask('${task._id}', 'daily')">Delete</button>
            </div>
        `;
        dailyList.appendChild(li);
    });
}

