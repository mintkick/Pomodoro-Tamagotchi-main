
const petBusiness = {

    async createPet(task) {
        const taskWithType = {
            ...task,
            type: currentTaskType // 'daily' or 'scheduled'
        };
        
        fetch("/pet", {
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

    async updatePet(id, data) {
        await fetch(`/pet/${id}`, {
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
    async getPet() {
        await fetch(`/pet`)
        
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

export default petBusiness;
