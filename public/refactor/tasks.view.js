/**
 * Action type - Which button opened the modal
 * 
 * Based on actionType, should it call updateTask or saveTask
 */

// Keeps track of created tasks on the HTML side



allTasks = [];

function openModal(actionType, taskType, handleSubmitCallback) {
    
    // called by save button
    const modal = getElement("task-modal");
    // modal.style.display = "block";
    
    modalTitle = getElement('modal-title');
    taskNameInput = getElement('task-name-input')
    taskDateInput = getElement('task-date-input');

    // saveButton.onclick = () => {
    //   handleSubmitCallback();
    //   closeModal();
    //   saveButton.onclick = undefined;
    // };// clear inputs and decide if date input shoulb be displayed
    
    if (actionType == 'create'){
        modalTitle.textContent = `Add ${taskType} Task`;
        taskNameInput.value = '';
        taskDateInput.value = '';
    }
    else if (actionType == 'update'){
        const taskIndex = allTasks.findIndex((t) => t.id === task.id);
    if (taskIndex === -1) return;
        modalTitle.textContent = `Update ${taskType} Task`;
        getElement("task-name-input").value = allTasks[taskIndex].text;
        getElement("task-date-input").value =
        allTasks[taskIndex].dueDate || "";
    }
    taskDateInput.style.display = taskType === 'daily' ? 'none' : 'block';
    modal.style.display = 'block';
    // 
    
    const saveButton = getElement('save-task-button');
    
    // creates the button for create or update
    // calls either function 
    // undefines the button after the click
    saveButton.onclick = () => {
        handleSubmitCallback(taskType)
        closeModal()
        saveButton.onclick = undefined
    }
}

/**
 * Hide the modal
 * Clear the inputs
 */
function closeModal() {
    const modal = document.getElementById("task-modal");
    modal.style.display = "none";
    getElement("task-name-input").value = "";
    getElement("task-date-input").value = "";
}

/**
 * This will take a task object, and render it into the HTML, into the right spot
 * 
 * If the task element exists, replace it. If it doesn't create it
 */
async function createTask(taskType){
    const taskName = getElement('task-name-input').value.trim();
    const taskDate = getElement('task-date-input').value;

    if (!taskName) {
        alert('Please enter a task name');
        return;
    }

    if (taskType === 'scheduled' && !taskDate) {
        alert('Please select a date for scheduled task');
        return;
    }

    const taskData = {
        text: taskName,
        type: taskType,
        dueDate: taskType === 'scheduled' ? taskDate : null
    };
    // console.log(taskData)
    await business.createTask(taskData);
    renderTask(taskData);
}



function updateTask(task){
    

    const updatedData = {
        id: task.id, // Ensure the ID remains the same
        text: getElement("task-name-input").value.trim(),
        type: type,
        dueDate:
          type === "scheduled"
            ? getElement("task-date-input").value
            : null,
      };
      try{
        business.updateTask(task.id, updatedData);
      } catch (error) {
          console.error("Error updating task:", error);
          alert("Error updating task2");
        }
    
    

}

function deleteTask(task){
    
}




function renderTask(task) {

    // Lookup task HTML element.
    // If it exists, update
    // If it doesn't, create


    const li = document.createElement('li');
    var taskList = getElement('daily-tasks-list');
    const span = document.createElement('span');
    console.log('task', task)
    if (task.type === 'daily') {
        taskList = getElement('daily-tasks-list');
        span.innerHTML = task.text
 
    } else {
        list = getElement('scheduled-tasks-list');
        span.innerHTML = task.text, task.dueDate ? ` - Due: ${task.dueDate}` : ''
    }
    li.appendChild(span);
    li.innerHTML += `
            <div class="task-buttons">
                <button onclick="openModal('update', '${task.type}', '${updateTask}')">Edit</button>
                <button onclick="deleteTask('${task.id}', ${task.type})">Delete</button>
            </div>
        `;

   
    // li.innerHTML += `
    //         <div class="task-buttons">
    //             <button onclick="openModal('update', '${task.type}', '${updateTask}')">Edit</button>
    //             <button onclick="deleteTask('${task.id}', ${task.type})">Delete</button>
    //         </div>
    //     `;
    taskList.appendChild(li);

}

/**
 * Loop over each task and call renderTask
 */
function renderAllTasks(tasks) {
    // foreach (var task  tasks){
    //     if (!(task in allTasks)){
    //         allTasks.push(task)
    //     }
    //     console.log('all tasks:', task)
    //     renderTask(task);
    // }
    for (const task of tasks){
        renderTask(task)
    }

    // tasks.forEach(renderTask(task))
    console.log("tasks rendered")
}

/**
 * Get the HTML element. Handle if it doesn't exist
 */
function getElement(id) {
    return document.getElementById(id);
}

/**
 * If the tab is click, it should switch to it
 */
function switchTab(tabIndex) {
    const dailyContent = getElement("daily-tasks-content");
    const dailyTab = getElement("daily-tasks-tab");
    const scheduledTab = getElement("scheduled-tasks-tab");
    const tasksContent = getElement("scheduled-tasks-content");
    if (tabIndex === "daily") {
        dailyContent.style.display = 'block';
        tasksContent.style.display = 'none';
        if (!dailyTab.classList.contains("clicked")){
            dailyTab.classList.add("clicked");
            scheduledTab.classList.remove("clicked");

        }
        console.log("daily", dailyTab.classList)
    } else if (tabIndex === "scheduled") {
        dailyContent.style.display = 'none';
        tasksContent.style.display = 'block';
        if (!scheduledTab.classList.contains("clicked")){
            scheduledTab.classList.add("clicked");
            dailyTab.classList.remove("clicked");
        }
        console.log("scheduled", scheduledTab.classList)
    }
}

/**
 * Call business.listTasks() and call renderAllTasks
 * 
 * Example
 * 
 * const tasks = await business.listTasks()
 * renderAllTasks(tasks)
 * 
 * 
 * dailyTaskButtonElement.onclick = () => {
 *  openModal('daily', () => {
 *  
 *    business.createTask({ ... })
 * 
 *  })
 * }
 * 
 * scheduledTaskButtonElement.onclick = () => {
 *  openModal('scheduled', () => {
 *  
 *    const newTask = await business.createTask({ ... })
 *    renderTask(newTask)
 * 
 *  })
 * }
 */
async function init() {
    var tasks = await business.listTasks();
    console.log(tasks[0])
    renderAllTasks(tasks)
    console.log('init tasks rendered')
    getElement('add-daily-task-button').addEventListener('click', () => openModal('create', 'daily', createTask));
    getElement('add-scheduled-task-button').addEventListener('click', () => openModal('update', 'scheduled', createTask));
    // getElement("scheduled-tasks-tab").addEventListener("click", switchTab("scheduled",));
    // getElement("daily-tasks-tab").addEventListener("click", switchTab("daily",));
}

init()