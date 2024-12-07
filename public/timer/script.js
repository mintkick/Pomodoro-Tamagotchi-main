import pet  from '../Pet.js'; 
document.addEventListener('DOMContentLoaded', function () {
    const timerDisplay = document.getElementById('timer-display');

    //Returns a string with the time formated like a digital clock
    function formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60)+hours*60;
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    function getTimeInSeconds(id) {
        const minutes = parseInt(document.getElementById(id).value, 10);
        return minutes * 60;
    }

    let timerInterval;
    let timeLeft;
    let workSessions = 0;
    let pomoSessions = 0;
    let flow = '';
    const sessCompleted = document.getElementById('sessions-completed');
    sessCompleted.textContent = workSessions;
    const pomoCompleted = document.getElementById('pomo-sessions-completed');
    pomoCompleted.textContent = pomoSessions;
    const flowCounter = document.getElementById('flow');
    flowCounter.textContent=flow;

    //Changes time displayed on timer for work sessions
    function startTimer(){
        console.log(flow);
        clearInterval(timerInterval);
        timeLeft = getTimeInSeconds('work-options');
        timerDisplay.textContent = formatTime(timeLeft);
        const counter = document.getElementById('sessions');
        const form1 = document.getElementsByClassName('form');
        if (counter && form1) {
            counter.style.display = 'none';
            form1[0].style.display = 'none';
        }
        function updateTimer() {
            if (timeLeft > 0) { 
                timeLeft--; //subtract the amount of time every second
                timerDisplay.textContent = formatTime(timeLeft); //calls the formatTime function to change the value of timerDisplay
            } else {
                clearInterval(timerInterval);
                workSessions++;
                pet.addFood()
                console.log(workSessions);
                console.log(pet.food)
                sessCompleted.textContent = workSessions;
                if (counter && form1) {
                    counter.style.display = 'block';
                    form1[0].style.display = 'block';
                }
                if (workSessions % 4 === 0)
                {
                    flow += '⬤';
                    flowCounter.textContent = flow;
                    startLongBreak();
                }
                else
                {
                    flow += '⬤';
                    flowCounter.textContent = flow
                    startShortBreak();
                }
            }
        }
        timerInterval = setInterval(updateTimer, 1000); //update every second
    }

    function startShortBreak() {
        timeLeft = getTimeInSeconds('short')
        timerDisplay.textContent = formatTime(timeLeft);
        function updateTimer() {
            if (timeLeft > 0) {
                timeLeft--;
                timerDisplay.textContent = formatTime(timeLeft)
            }
            else {
                flow += '⬤';
                flowCounter.textContent = flow
                startTimer();
            }
        }
        timerInterval = setInterval(updateTimer, 1000)
    }

    function startLongBreak() {
        timeLeft = getTimeInSeconds('long');
        timerDisplay.textContent = formatTime(timeLeft);
        flowCounter.textContent = flow;

        function updateTimer() {
            if (timeLeft > 0) {
                timeLeft--;
                timerDisplay.textContent = formatTime(timeLeft)
                pet.addFood()
            }
            else {
                pomoSessions++;
                pomoCompleted.textContent = pomoSessions;
                flow = 'You just completed one session!';
                flowCounter.textContent = flow;
                startTimer()
            }
        }
        timerInterval = setInterval(updateTimer, 1000)
    }

    // Allow user to finish timer
    const finishButton = document.getElementById('exit-button');
    finishButton.addEventListener('click', function() {
        timeLeft = 0;});
    // Allow user to reset timer
    const resetButton = document.getElementById('reset-button');
    resetButton.addEventListener('click', function() {
        flow = '⬤';
        startTimer();});

    document.getElementById('start-button').addEventListener('click', startTimer);
});