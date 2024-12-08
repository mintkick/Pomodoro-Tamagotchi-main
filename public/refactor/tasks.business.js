/**
 * Business logic file. Do not access any HTML elements or CSS
 * Do not call any functions which have access to them either
 */

const business = {
    /**
     * Make the fetch call to the server
     * handle the response
     * return the new object
     */
    async createTask(task) {
        const taskWithType = {
            ...task,
            
        };
        
        return fetch("/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(taskWithType),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to create task");
                }
                return response.json();
            })
            .catch((error) => {
                console.error(error);
                alert("Error creating task");
            });
    },

    /**
     * Make the fetch call to the server
     * handle the response
     * return the new object
     */
    async updateTask(id, data) {
        return await fetch(`/tasks/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to update task");
                }
                return response.json();
            })
            .catch((error) => {
                console.error(error);
                alert("Error updating task");
            });
    },

    /**
     * Make the fetch call to the server
     * handle the response
     * return the new object
     */
    async deleteTask(id) {
        return await fetch(`/tasks/${id}`, {
            method: "DELETE",
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to delete task");
            }
            return response.json();
        })
        .catch((error) => {
            console.error('Error deleting task:', error);
        });
    },

    /**
     * Make the fetch call to the server
     * handle the response
     * return the new object
     */
    async listTasks() {
        return await fetch(`/tasks`)
        
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed list tasks");
                }
                return response.json();
            })
        .catch((error) => {
            console.error('Error listing tasks:', error);
        });

    }
}

