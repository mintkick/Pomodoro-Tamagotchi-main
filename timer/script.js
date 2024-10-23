var time = prompt("How many minutes will you work? ");
let timeLeft = time * 60; 
const maxLineLength = 298; 
let displayAnimation = "|".repeat(timeLeft); 

const timerDisplay = document.getElementById("timer-display");

function formatDisplay(displayAnimation) {
    let formattedDisplay = "";

    for (let i = 0; i < displayAnimation.length; i++) {
        formattedDisplay += displayAnimation[i];
        if ((i + 1) % maxLineLength === 0 && i !== displayAnimation.length - 1) {
            formattedDisplay += '<br>'; 
        }
    }
    return formattedDisplay;
}

function updateTimer() {
    if (timeLeft > 0) {
        timeLeft--;

    
        displayAnimation = displayAnimation.slice(0, -1);

      
        timerDisplay.innerHTML = formatDisplay(displayAnimation);
    } else {
        clearInterval(timerInterval); 
        timerDisplay.textContent = "Good Job!";
    }
}


const timerInterval = setInterval(updateTimer, 1000);


timerDisplay.innerHTML = formatDisplay(displayAnimation);
