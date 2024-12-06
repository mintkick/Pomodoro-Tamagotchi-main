const dataModel = {
    tasks: [],
    assignments: [],
    points: 0,
};
if (!sessionStorage.getItem('userData')) {
    sessionStorage.setItem('userData', JSON.stringify(dataModel));
}

function addTask(task) {
    // Retrieve current data
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    // Add new task
    userData.tasks.push(task);
    // Save updated data
    sessionStorage.setItem('userData', JSON.stringify(userData));
}

function displayTasks() {
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    const taskList = document.getElementById('task-list'); // Assuming you have an element with this ID
    taskList.innerHTML = ''; // Clear the list
    userData.tasks.forEach((task, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = task;
        taskList.appendChild(listItem);
    });
}


function updatePoints(pointsToAdd) {
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    userData.points += pointsToAdd;
    sessionStorage.setItem('userData', JSON.stringify(userData));
}

function displayPoints() {
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    const pointsDisplay = document.getElementById('points-display'); // Assuming you have an element with this ID
    pointsDisplay.textContent = `Points: ${userData.points}`;
}


// Save JSON data
const jsonData = { key: "value" };
sessionStorage.setItem('jsonData', JSON.stringify(jsonData));

// Retrieve JSON data
const retrievedData = JSON.parse(sessionStorage.getItem('jsonData'));
console.log(retrievedData);

