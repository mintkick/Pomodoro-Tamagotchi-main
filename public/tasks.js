// Opening Task section JavaScript

// Variables to store tasks
let allTasks = []; // Add this line at the top
let currentTaskType = 'daily'; // Add this as a global variable

// Track if the modal is for a daily or due date task
let isDailyTask = true;

// Show the selected section
function showSection(section) {
    const dailyContent = document.getElementById("daily-tasks-content");
    const tasksContent = document.getElementById("scheduled-tasks-content");
    
    if (section === 'daily') {
        dailyContent.style.display = 'block';
        tasksContent.style.display = 'none';
        renderDailyTasks();
    } else if (section === 'tasks') {
        dailyContent.style.display = 'none';
        tasksContent.style.display = 'block';
        renderScheduledTasks();
    }
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
async function loadTasks() {
  try {
    const response = await fetch("/tasks");
    if (!response.ok) {
      throw new Error("Failed to fetch tasks");
    }
    allTasks = await response.json();
    renderDailyTasks();
    renderScheduledTasks();
  } catch (error) {
    console.error(error);
    alert("Error loading tasks");
  }
}

// Fix: Update currentTaskType when opening modal to ensure correct task type
/**
 * Enhanced modal opening function that properly tracks task type
 * @param {string} taskType - The type of task ('daily' or 'scheduled')
 * This fixes the issue where all tasks were being saved as daily tasks
 * by ensuring the task type is properly set when the modal opens
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
// function renderSubmittedTask(index = null) {
//     const taskInput = document.getElementById("task-input").value.trim();
//     const dateInput = document.getElementById("task-date-input").value;

//     if (isDailyTask) {
//         if (taskInput) {
//             if (index !== null) {
//                 dailyTasks[index].text = taskInput;
//             } else {
//                 dailyTasks.push({ id: Date.now(), text: taskInput, frequency: "daily" });
//                 console.log("Daily tasks:", dailyTasks);
//             }
//             renderDailyTasks();
//         } else {
//             alert("Please enter a daily task name.");
//             return;
//         }
//     } else {
//         if (taskInput && dateInput) {
//             if (index !== null) {
//                 tasks[index].text = taskInput;
//                 tasks[index].dueDate = dateInput;
//             } else {
//                 tasks.push({ id: Date.now(), text: taskInput, dueDate: dateInput });
//             }
//             loadTasks();
//         } else {
//             alert("Please enter a task name and due date.");
//             return;
//         }
//     }
    
//     closeModal(); // Close the modal after adding/editing the task
// }

// Reset daily tasks
function resetDailyTasks() {
    alert("Daily tasks have been reset!");
    dailyTasks = []; // Clear all daily tasks
    // loadDailyTasks(); // Reload the daily tasks
    renderDailyTasks()
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

    function openAddTaskModal() {
        modalTitle.textContent = `Add ${currentTaskType === 'daily' ? 'Daily' : 'Scheduled'} Task`;
        taskNameInput.value = '';
        taskDateInput.value = '';
        taskDateInput.style.display = currentTaskType === 'daily' ? 'none' : 'block';
        taskModal.style.display = 'block';
    }

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
  };

  // Show the modal
  document.getElementById("task-modal").style.display = "block";
}


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

// Closing Task section JavaScript

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

function openModal() {
  document.getElementById("task-modal").style.display = "block";
}

function closeModal() {
  document.getElementById("task-modal").style.display = "none";
}

// Fix: Update the submitTask function to use the correct task type
/**
 * Enhanced submitTask function that preserves task type
 * @param {Object} task - The task object containing type information
 * Previous version was overwriting task type with global variable
 * Now sends task object directly to server without modification
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

// Update DOMContentLoaded to load all tasks initially
document.addEventListener('DOMContentLoaded', function() {
    
    
    // Initial load of all tasks
    loadTasks();
    showSection('daily');
});

document.addEventListener('DOMContentLoaded', function() {
  

    /**
     * Enhanced button handlers that explicitly pass task type
     * This ensures the correct task type is set when opening the modal
     * Previous version wasn't properly tracking task type
     */
    document.getElementById('add-daily-task-button').addEventListener('click', () => {
        currentTaskType = 'daily';
        openModal('daily'); // Explicitly pass task type
    });

    document.getElementById('add-scheduled-task-button').addEventListener('click', () => {
        currentTaskType = 'scheduled';
        openModal('scheduled'); // Explicitly pass task type
    });

    /**
     * Enhanced save button handler with improved type detection
     * Now determines task type based on modal state rather than global variable
     * This provides more reliable task type tracking
     */
    saveTaskButton.addEventListener('click', async () => {
        const taskName = taskNameInput.value.trim();
        const taskDate = taskDateInput.value;

        if (!taskName) {
            alert('Please enter a task name');
            return;
        }

        // Determine task type based on modal state instead of global variable
        const type = document.getElementById('task-date-input').style.display === 'none' ? 'daily' : 'scheduled';

        if (type === 'scheduled' && !taskDate) {
            alert('Please select a date for scheduled task');
            return;
        }

        const taskData = {
            text: taskName,
            type: type, // Use determined type instead of global variable
            dueDate: type === 'scheduled' ? taskDate : null
        };
        
        submitTask(taskData);
        closeModal();
        loadTasks();
    });

    
});

// Fix: Update submitTask to ensure type is preserved
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

async function editTask(taskId, type) {
    const taskIndex = allTasks.findIndex((t) => t._id === taskId);
    if (taskIndex === -1) return;
    
    const task = allTasks[taskIndex];
    
    // Set up modal inputs
    document.getElementById("task-name-input").value = task.text;
    document.getElementById("task-date-input").value = task.dueDate || "";
    document.getElementById("task-date-input").style.display = type === "daily" ? "none" : "block";
    document.getElementById("modal-title").textContent = `Edit ${type === "daily" ? "Daily" : "Scheduled"} Task`;

    // Show the modal
    const modal = document.getElementById('task-modal');
    modal.style.display = 'block';

    // Update save button handler
    const saveButton = document.getElementById('save-task-button');
    const newSaveButton = saveButton.cloneNode(true);
    saveButton.parentNode.replaceChild(newSaveButton, saveButton);
    
    newSaveButton.addEventListener('click', async () => {
        const updatedData = {
            text: document.getElementById('task-name-input').value.trim(),
            type: type,
            dueDate: type === 'scheduled' ? document.getElementById('task-date-input').value : null
        };
        
        try {
            const updatedTask = await updateTask(taskId, updatedData);
            // Update the task in allTasks array immediately
            const index = allTasks.findIndex(t => t._id === taskId);
            if (index !== -1) {
                allTasks[index] = updatedTask;
            }
            updateUIAfterChange();
            closeModal();
        } catch (error) {
            console.error('Error updating task:', error);
            alert('Error updating task');
        }
    });
}

// Add the updateTask function that was commented out before, with improvements
async function updateTask(id, updatedData) {
    try {
        const response = await fetch(`/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        });

        if (!response.ok) {
            throw new Error('Failed to update task');
        }

        const updatedTask = await response.json();
        
        // Update the task in allTasks array
        const taskIndex = allTasks.findIndex(t => t._id === id);
        if (taskIndex !== -1) {
            allTasks[taskIndex] = updatedTask;
        }

        // Re-render the appropriate list
        if (updatedData.type === 'daily') {
            renderDailyTasks();
        } else {
            renderScheduledTasks();
        }

    } catch (error) {
        console.error('Error updating task:', error);
        throw error; // Propagate error to be handled by caller
    }
}

// Update the renderDailyTasks and renderScheduledTasks functions to use _id
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

// Update deleteTask to properly handle UI updates
async function deleteTask(taskId, type) {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
        const response = await fetch(`/tasks/${taskId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to delete task');
        
        // Update local data using _id for consistency with MongoDB
        allTasks = allTasks.filter(task => task._id !== taskId);
        
        // Render both lists to ensure UI is in sync
        renderDailyTasks();
        renderScheduledTasks();
    } catch (error) {
        console.error('Error deleting task:', error);
        alert('Error deleting task');
    }
}

// Update updateTask to properly handle UI updates
async function updateTask(id, updatedData) {
    const response = await fetch(`/tasks/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
        throw new Error('Failed to update task');
    }

    return await response.json();
}

// Add a new helper function to update UI
function updateUIAfterChange() {
    renderDailyTasks();
    renderScheduledTasks();
}

// Update submitTask to use the new UI update helper
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

