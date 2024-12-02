document.getElementById('login-btn').addEventListener('click', () => {
  window.location.href = '/login';
});

document.getElementById('logout-btn').addEventListener('click', () => {
  window.location.href = '/logout';
});

window.onload = () => {
  fetch('/user')
    .then(response => response.json())
    .then(user => {
      if (user) {
        document.getElementById('login-btn').style.display = 'none';
        document.getElementById('logout-btn').style.display = 'block';
        document.getElementById('userName').textContent = user.name;
        document.getElementById('userProfilePicture').src = user.picture;
        document.getElementById('userProfilePicture').style.display = 'block';
      } else {
        document.getElementById('login-btn').style.display = 'block';
        document.getElementById('logout-btn').style.display = 'none';
        document.getElementById('userName').textContent = '';
        document.getElementById('userProfilePicture').style.display = 'none';
      }
    });
};

// Remove the loadTasks function and its call as it is already handled in tasks.js