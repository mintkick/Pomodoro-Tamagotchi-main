
// Log button clicks
document.getElementById("login-btn").addEventListener("click", () => {
  console.log("Login button clicked - Redirecting to login page");
  window.location.href = "/login";
});

document.getElementById("logout-btn").addEventListener("click", () => {
  console.log("Logout button clicked - Redirecting to logout page");
  window.location.href = "/logout";
});

window.addEventListener('load', () => {
  console.log("Page loaded - Fetching user data...");

  fetch("/user")
    .then((response) => {
      console.log("Response status:", response.status);
      return response.json();
    })
    .then((user) => {
      console.log("User data received:", user);
      if (user) {
        document.getElementById("login-btn").style.display = "none";
        document.getElementById("logout-btn").style.display = "block";
        document.getElementById("userName").textContent = user.name;
        document.getElementById("userProfilePicture").src = user.picture;
        document.getElementById("userProfilePicture").style.display = "block";
        document.querySelector("main").style.display = "block";

        console.log("starting saveData");
        saveData(user);
        loadTasks(); // Always load tasks
      } else {
        document.getElementById("login-btn").style.display = "block";
        document.getElementById("logout-btn").style.display = "none";
        document.getElementById("userName").textContent = "";
        document.getElementById("userProfilePicture").style.display = "none";
        document.querySelector("#login_message").style.display = "flex";
      }
    })
    .catch((error) => {
      console.error("Error fetching user data:", error);
    });
})

async function saveData(userData) {
  window.user = await fetch('/user', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)

  })
  .then((response) => {
    if (!response.ok) {
      throw new Error("Failed to fetch user information");
    }
    return response.json();
  });
}

function loadTasks() {
  fetch("/tasks")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }
      return response.json();
    })
    .then((tasks) => {
      const taskList = document.getElementById("task-list");
      taskList.innerHTML = "";
      tasks.forEach((task) => {
        const taskItem = document.createElement("li");
        taskItem.textContent = `${task.text} - Due: ${
          task.dueDate || "No due date"
        }`;
        taskList.appendChild(taskItem);
      });
    })
    .catch((error) => {
      console.error(error);
      alert("Error loading tasks");
    });
}


