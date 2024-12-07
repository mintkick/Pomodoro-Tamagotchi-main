/**
 * Action type - Which button opened the modal
 * 
 * Based on actionType, should it call updateTask or saveTask
 */
function openModal(actionType, handleSubmitCallback) {
    /**
     * saveButton.onclick = () => {
     *   handleSubmitCallback()
     *   saveButton.onclick = undefined
     * }
     */
}

/**
 * Hide the modal
 * Clear the inputs
 */
function closeModal() {

}

/**
 * This will take a task object, and render it into the HTML, into the right spot
 * 
 * If the task element exists, replace it. If it doesn't create it
 */
function renderTask(task) {

    // Lookup task HTML element.
    // If it exists, update
    // If it doesn't, create

    if (task.type === 'daily') {

    } else {

    }
}

/**
 * Loop over each task and call renderTask
 */
function renderAllTasks(tasks) {

}

/**
 * Get the HTML element. Handle if it doesn't exist
 */
function getElement(id) {
    // return document.getElementById(id)
}

/**
 * If the tab is click, it should switch to it
 */
function switchTab(tabIndex) {

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
function init() {

}

init()