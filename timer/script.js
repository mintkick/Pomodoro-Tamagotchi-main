var time = prompt("How many minutes will you work? ");
let timeLeft = time * 60; 

const timerDisplay = document.getElementById("timer-display");

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}


function updateTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        timerDisplay.textContent = formatTime(timeLeft);
    } else {
        clearInterval(timerInterval); // Stop the timer when it reaches 0
        timerDisplay.textContent = "Time's up!";
    }
}


const timerInterval = setInterval(updateTimer, 1000);


timerDisplay.innerHTML = formatDisplay(displayAnimation);
