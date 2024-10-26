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

    function getShortBreakTimeInSeconds() {
        const shortBreakMinutes = parseInt(document.getElementById('short').value, 10); //gets time from the form
        return shortBreakMinutes * 60; //converts minutes to seconds
    }
    
    function getLongBreakTimeInSeconds() {
        const longBreakMinutes = parseInt(document.getElementById('long').value, 10); //gets time from the form
        return longBreakMinutes * 60; //converts minutes to seconds
    }

    let timerInterval;
    let timeLeft;
    let workSessions = 0;

    //Changes time displayed on timer for work sessions
    function startTimer(){
        clearInterval(timerInterval);
        timeLeft = getWorkTimeInSeconds();
        timerDisplay.textContent = formatTime(timeLeft);
        function updateTimer() {
            if (timeLeft > 0) { 
                timeLeft--; //subtract the amount of time every second
                timerDisplay.textContent = formatTime(timeLeft); //calls the formatTime function to change the value of timerDisplay
            } else {
                clearInterval(timerInterval);
                workSessions++;
                if (workSessions % 4 === 0)
                {
                    startLongBreak();
                }
                else
                {
                    startShortBreak();
                }
            }
        }
        timerInterval = setInterval(updateTimer, 1000); //update every second
    }

    function startShortBreak() {
        timeLeft = getShortBreakTimeInSeconds();
        timerDisplay.textContent = formatTime(timeLeft);

        function updateTimer() {
            if (timeLeft > 0) {
                timeLeft--;
                timerDisplay.textContent = formatTime(timeLeft)
            }
            else {
                startTimer();
            }
        }
        timerInterval = setInterval(updateTimer, 1000)
    }

    function startLongBreak() {
        timeLeft = getLongBreakTimeInSeconds();
        timerDisplay.textContent = formatTime(timeLeft);

        function updateTimer() {
            if (timeLeft > 0) {
                timeLeft--;
                timerDisplay.textContent = formatTime(timeLeft)
            }
            else {
                startTimer()
            }
        }
        timerInterval = setInterval(updateTimer, 1000)
    }

    // TODO allow user to exit timer
    // TODO allow user to reset timer
    // TODO display how many work sessions have been completed
    // TODO display how many full Pomo-sessions have been completed?

    document.getElementById("start-button").addEventListener("click", startTimer);
});