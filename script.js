var timer;
var timerDisplay = document.getElementById("timer");
var subdivisionsInput = document.getElementById("subdivisions");
var subdivisionInputsContainer = document.getElementById("subdivisionInputs");
var subdivisionDurations = [];

function toggleTextBox() {
    var textBox = document.getElementById("textBox");
    textBox.classList.toggle("active");
}

function closeTextBox() {
    var textBox = document.getElementById("textBox");
    textBox.classList.remove("active");
}

function generateSubdivisionInputs() {
    var subdivisions = parseInt(subdivisionsInput.value);
    if (subdivisions > 30) {
        alert("Cannot set more than 30 Slots.");
        return;
    }

    subdivisionInputsContainer.innerHTML = ""; // Clear any existing inputs

    for (var i = 0; i < subdivisions; i++) {
        var inputContainer = document.createElement("div");
        inputContainer.className = "input-container";

        var label = document.createElement("label");
        label.textContent = "Slot " + (i + 1) + " Duration:";
        inputContainer.appendChild(label);

        var inputMinutes = createInput("number", "Minutes", "1", "Minutes");
        var inputSeconds = createInput("number", "Seconds", "0", "Seconds");

        inputContainer.appendChild(inputMinutes);
        inputContainer.appendChild(inputSeconds);

        subdivisionInputsContainer.appendChild(inputContainer);
    }
}

function createInput(type, defaultValue, step, placeholder) {
    var input = document.createElement("input");
    input.type = type;
    input.value = defaultValue;
    input.step = step;
    input.placeholder = placeholder;
    input.className = "duration-input";

    return input;
}

var breakTimer; // Variable to hold the break timer
var currentSubdivision = 0; // Variable to track the current subdivision

function startTimer() {
    var howToUseButton = document.getElementById("howToUseButton");
    howToUseButton.style.display = "none";
    var inputContainers = subdivisionInputsContainer.getElementsByClassName("input-container");

    subdivisionDurations = [];
    for (var i = 0; i < inputContainers.length; i++) {
        var inputMinutes = inputContainers[i].getElementsByClassName("duration-input")[0];
        var inputSeconds = inputContainers[i].getElementsByClassName("duration-input")[1];

        var minutes = parseInt(inputMinutes.value) || 0;
        var seconds = parseInt(inputSeconds.value) || 0;

        var duration = (minutes * 60) + seconds;

        if (isNaN(duration) || duration <= 0) {
            alert("Please enter valid durations for all the slots.");
            return;
        }

        subdivisionDurations.push(duration);
    }

    if (subdivisionDurations.length === 0) {
        alert("Please enter slot durations before starting the timer.");
        return;
    }

    var seconds = subdivisionDurations[currentSubdivision];

    timerDisplay.textContent = formatTime(seconds);
    stopBreakSound();
    playOhmSound();

    timer = setInterval(function() {
        seconds--;

        if (seconds < 0) {
            clearInterval(timer);
            timerDisplay.textContent = "Break";
            playBreakSound();

            if (currentSubdivision < subdivisionDurations.length - 1) {
                breakTimer = setTimeout(function() {
                    stopBreakSound();
                    currentSubdivision++;
                    seconds = subdivisionDurations[currentSubdivision];
                    timerDisplay.textContent = formatTime(seconds);
                    startTimer();
                }, 21000); // 10-second break
            } else {
                currentSubdivision++;
                if (currentSubdivision < subdivisionDurations.length) {
                    seconds = subdivisionDurations[currentSubdivision];
                    timerDisplay.textContent = formatTime(seconds);
                    startTimer();
                } else {
                    timerDisplay.textContent = "Session Completed";
                    playAlarmSound();

                    setTimeout(function() {
                        var refresh = confirm("Timer completed. Refresh the page to start a new session?");
                        if (refresh) {
                            location.reload();
                        }
                    }, 17000);
                }
            }
            return;
        }

        timerDisplay.textContent = formatTime(seconds);
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
    clearTimeout(breakTimer);
    timerDisplay.textContent = "";
    subdivisionDurations = [];
    subdivisionInputsContainer.innerHTML = "";
    currentSubdivision = 0;
}

function formatTime(seconds) {
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = seconds % 60;

    return minutes + ":" + (remainingSeconds < 10 ? "0" : "") + remainingSeconds;
}

function playAlarmSound() {
    var alarmSound = document.getElementById("alarmSound");
    alarmSound.currentTime = 0;
    ohmSound.pause();
    breakSound.pause();
    alarmSound.play();
    setTimeout(stopAlarmSound, 17000);
}

function stopAlarmSound() {
    var alarmSound = document.getElementById("alarmSound");
    alarmSound.pause();
    alarmSound.currentTime = 0;
}

function playOhmSound() {
    var ohmSound = document.getElementById("ohmSound");
    ohmSound.currentTime = 0;
    ohmSound.play();
}

function stopOhmSound() {
    var ohmSound = document.getElementById("ohmSound");
    ohmSound.pause();
    ohmSound.currentTime = 0;
}

function playBreakSound() {
    var breakSound = document.getElementById("breakSound");
    breakSound.currentTime = 0;
    ohmSound.pause();
    breakSound.play();
}

function stopBreakSound() {
    var breakSound = document.getElementById("breakSound");
    breakSound.pause();
    breakSound.currentTime = 0;
}

