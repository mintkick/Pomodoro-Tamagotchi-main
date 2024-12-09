/**
 * Action type - Which button opened the modal
 * 
 * Based on actionType, should it call updateTask or saveTask
 */

// Keeps track of created tasks on the HTML side



allTasks = [];

function openModal(actionType, taskType, handleSubmitCallback, taskId) {
    
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
        if (taskId === undefined) {
            console.log('open modal: There is no task id')
        }else{
            console.log('open modal', taskId)

        }
        const taskIndex = allTasks.findIndex((t) => t.id === taskId);
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
        if (taskId === undefined) {
            handleSubmitCallback(taskType)
        }else{
            handleSubmitCallback(taskType, taskId)
        }
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
    console.log("about to save task")
    await business.createTask(taskData);
    renderTask(taskData);
}

// updateTask2: async (taskId, actionType, taskType, handleSubmitCallback) => {
//     return await openModal(async (actionType, taskType, updateTask(task)));
//   }

async function updateTask(type, taskId){
    console.log("attempting to update task")

    const updatedData = {
        
        id: taskId, // Ensure the ID remains the same
        text: getElement("task-name-input").value.trim(),
        type: type,
        dueDate:
          type === "scheduled"
            ? getElement("task-date-input").value
            : null,
      };
      try{
        await business.updateTask(taskId, updatedData);
      } catch (error) {
          console.error("Error updating task:", error);
          alert("Error updating task in view");
        }
    
    

}

function deleteTask(id){
    business.deleteTask(id);
    allTasks = allTasks.filter((task) => task.id !== id);
}




function renderTask(task) {

    // Lookup task HTML element.
    // If it exists, update
    // If it doesn't, create


    const li = document.createElement('li');
    var taskList = getElement('daily-tasks-list');
    const span = document.createElement('span');
    // console.log('task', task.id)
    if (task.type === 'daily') {
        taskList = getElement('daily-tasks-list');
        span.innerHTML = task.text
 
    } else {
        taskList = getElement('scheduled-tasks-list');
        span.innerHTML = task.text, task.dueDate ? ` - Due: ${task.dueDate}` : ''
        console.log('render', task)
    }
    li.appendChild(span);
    const buttons = document.createElement('div');

    buttons.innerHTML = `
                <button class="edit-button" id="${task.id}">Edit</button>
                <button class="delete-button">Delete</button>
        `;

        // <button onclick="openModal('update', '${task.type}', '${updateTask()}')">Edit</button>
        // <button onclick="deleteTask('${task.id}', ${task.type})">Delete</button>
    edits = document.getElementsByClassName('edit-button');
    var found = false;
    li.appendChild(buttons)
    
    taskList.appendChild(li);


    for (const edit of edits){
        if (edit.id == task.id){
            console.log('button has the id and class')
            edit.addEventListener('click', () => openModal('update', task.type, updateTask, task.id))
            found = true;
        }

    }
    if (found === false){
        console.log('could not find edit button')
    }

}

/**
 * Loop over each task and call renderTask
 */
function renderAllTasks(tasks) {
    // foreach (var task  tasks){
        //     renderTask(task);
        // }
    for (const task of tasks){
        if (!(task in allTasks)){
            allTasks.push(task)
        }
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
    renderAllTasks(tasks)
    console.log('init tasks rendered')
    getElement('add-daily-task-button').addEventListener('click', () => openModal('create', 'daily', createTask));
    getElement('add-scheduled-task-button').addEventListener('click', () => openModal('create', 'scheduled', createTask));
    // edits = document.getElementsByClassName('edit-button');
    // for (const edit of edits){
    //     edit.addEventListener('click', () => openModal('update', task.type, updateTask))

    // }
    console.log(allTasks[0])
    // getElement("scheduled-tasks-tab").addEventListener("click", switchTab("scheduled",));
    // getElement("daily-tasks-tab").addEventListener("click", switchTab("daily",));
}

document.addEventListener('DOMContentLoaded', () => {
    
    init()
    console.log('DOM is fully loaded!');
  });