document.addEventListener("DOMContentLoaded", function () {
    const timerDisplay = document.getElementById("timer-display");

    //Returns a string with the time formated like a digital clock
    function formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    function getWorkTimeInSeconds() {
        const workMinutes = parseInt(document.getElementById('work-options').value, 10); //gets time from the form
        return workMinutes * 60; //converts minutes to seconds
    }

    let timerInterval;
    let timeLeft;

    //Changes time displayed on timer
    function startTimer(){
        clearInterval(timerInterval);
        timeLeft = getWorkTimeInSeconds();
        timerDisplay.textContent = formatTime(timeLeft);
        function updateTimer() {
            if (timeLeft > 0) { 
                timeLeft--; //subtract the amount of time every second
                timerDisplay.textContent = formatTime(timeLeft); //calls the formatTime function to change the value of timerDisplay
            } else {
                clearInterval(timerInterval); //replace the timer with a message once the time is up
                timerDisplay.textContent = "Time's up!";
            }
        }
        timerInterval = setInterval(updateTimer, 1000); //update every second
    }



    document.getElementById("start-button").addEventListener("click", startTimer);
});