
// document.addEventListener('DOMContentLoaded', function() {
// const loadEl = document.querySelector('#load');
// console.log('The js is connected')
// // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
// // The Firebase SDK is initialized and available here!
//
// firebase.auth().onAuthStateChanged(user => { });
// firebase.database().ref('/path/to/ref').on('value', snapshot => { });
// firebase.firestore().doc('/foo/bar').get().then(() => { });
// firebase.functions().httpsCallable('yourFunction')().then(() => { });
// firebase.messaging().requestPermission().then(() => { });
// firebase.storage().ref('/path/to/ref').getDownloadURL().then(() => { });
// firebase.analytics(); // call to activate
// firebase.analytics().logEvent('tutorial_completed');
// firebase.performance(); // call to activate
//
// // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥

// try {
//     let app = firebase.app();
//     let features = [
//     'auth', 
//     'database', 
//     'firestore',
//     'functions',
//     'messaging', 
//     'storage', 
//     'analytics', 
//     'remoteConfig',
//     'performance',
//     ].filter(feature => typeof app[feature] === 'function');
//     loadEl.textContent = `Firebase SDK loaded with ${features.join(', ')}`;
// } catch (e) {
//     console.error(e);
//     loadEl.textContent = 'Error loading the Firebase SDK, check the console.';
// }
// );



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
}

// Load daily tasks into the daily tasks list
function loadDailyTasks() {
    const dailyList = document.getElementById("daily-tasks-list");
    dailyList.innerHTML = ""; // Clear existing tasks

    dailyTasks.forEach(task => {
        const li = document.createElement("li");
        li.textContent = task.text;
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

// Add a new task from the modal
function submitTask() {
    const taskInput = document.getElementById("task-input").value.trim();
    const dateInput = document.getElementById("task-date-input").value;

    if (isDailyTask) {
        if (taskInput) {
            dailyTasks.push({ id: Date.now(), text: taskInput, frequency: "daily" });
            loadDailyTasks();
        } else {
            alert("Please enter a daily task name.");
            return;
        }
    } else {
        if (taskInput && dateInput) {
            tasks.push({ id: Date.now(), text: taskInput, dueDate: dateInput });
            loadTasks();
        } else {
            alert("Please enter a task name and due date.");
            return;
        }
    }
    
    closeModal(); // Close the modal after adding the task
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


// function showSection(section){
//     // add css id, remove the id from the other tab
//     const tabs = document.getElementsByClassName('single-tab')
//     console.log(tabs)
//     const clickedId = event.target.id;
//     const selectedButton = document.getElementById(clickedId)
//     console.log(selectedButton.innerHTML)
//     selectedButton.setAttribute('id', 'clicked-tab')
    
//     for (tab in tabs){
//         if (tab != selectedButton){
//             console.log(tab)
//         }
//     }

//     // if (section == 'Daily'){
        

//     // }
//     // else if (section == 'Tasks'){

//     // }
// }
}

// Initial load of tasks when the page is ready
document.addEventListener("DOMContentLoaded", function() {
    loadDailyTasks();
    loadTasks();
});




// Closing Task section JavaScript