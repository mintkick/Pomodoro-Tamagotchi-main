
const petBusiness = {

    async createPet(pet) {
        // const taskWithType = {
        //     ...pet,
        //     type: currentTaskType // 'daily' or 'scheduled'
        // };
        
        fetch("/pet", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(pet),
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
                    throw new Error("Failed to update pet");
                }
                return response.json();
            })
            .catch((error) => {
                console.error(error);
                alert("Error updating pet");
            });
    },
    async getPet() {
        await fetch(`/pet`)
        
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to get pet");
                }
                return response.json();
            })
        .catch((error) => {
            console.error('Error getting pet:', error);
        });

    }
}

export default petBusiness;
