var time = prompt("How many minutes will you work? "); //javaScript prompt to get the timer time
let timeLeft = time * 60; 

const timerDisplay = document.getElementById("timer-display");

//Returns a string with the time formated like a digital clock
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

//Changes time displayed on timer
function updateTimer() {
    if (timeLeft > 0) { 
        timeLeft--; //subtract the amount of time every second
        timerDisplay.textContent = formatTime(timeLeft); //calls the formatTime function to change the value of timerDisplay
    } else {
        clearInterval(timerInterval); //replace the timer with a message once the time is up
        timerDisplay.textContent = "Time's up!";
    }
}


const timerInterval = setInterval(updateTimer, 1000); //update every second
