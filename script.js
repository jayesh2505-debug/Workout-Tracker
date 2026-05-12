const exerciseInput = document.getElementById('exercise-name');
const setsInput = document.getElementById('sets');
const repsInput = document.getElementById('reps');
const weightInput = document.getElementById('weight');
const unitInput = document.getElementById('unit');
const saveButton = document.querySelector('.Save');
const resetButton = document.querySelector('.Reset');
const workoutList = document.getElementById('workout-list');
const timerDisplay = document.getElementById('timer-display');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const resetTimerBtn = document.getElementById('reset-timer-btn');
const manualInput = document.getElementById('manual-input');


function displayWorkouts(workouts) {
    workoutList.innerHTML = '';

    workouts.forEach(function (workout, index) {
        const div = document.createElement('div');
        div.innerHTML = `
        <div class = "workout-info">      
           <p>
           ${workout.exercise} - 
           ${workout.sets} sets x
           ${workout.reps} reps x
           ${workout.weight}  ${workout.unit}
           </p>
           <small>${workout.date} at ${workout.time}</small>
           <small>Duration: ${workout.duration}</small>
        </div>

           <button onclick = "deleteWorkout(${index})">Delete</button>
        `;
        workoutList.appendChild(div);
    })
}


saveButton.addEventListener('click', function () {

    const exercise = exerciseInput.value
    const sets = setsInput.value
    const reps = repsInput.value
    const weight = weightInput.value
    const unit = unitInput.value

    if (exercise === '' || sets === '' || reps === '' || weight === '') {
        alert('Please Fill In All Fields');
        return;
    }

    const duration = timeUsed
        ? formatTime(seconds)
        : manualInput.value
            ? `${manualInput.value} mins`
            : 'Not recorded'

    const workout = {
        exercise: exercise,
        sets: sets,
        reps: reps,
        weight: weight,
        unit: unit,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        duration: duration
    };


    let workouts = JSON.parse(localStorage.getItem('workouts')) || [];
    workouts.push(workout);
    localStorage.setItem('workouts', JSON.stringify(workouts));


    displayWorkouts(workouts);


    exerciseInput.value = '';
    setsInput.value = '';
    repsInput.value = '';
    weightInput.value = '';
    resetTimer();
});

function deleteWorkout(index) {
    let workouts = JSON.parse(localStorage.getItem('workouts')) || [];
    workouts.splice(index, 1);
    localStorage.setItem('workouts', JSON.stringify(workouts));
    displayWorkouts(workouts);
}


/// TIMER LOGIC


let timerInterval = null;
let seconds = 0;
let timeUsed = false;
const MAX_SECONDS = 10800; // 3 hours

function formatTime(secs) {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}


function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    seconds = 0;
    timeUsed = false;
    timerDisplay.textContent = '00:00:00'
    startBtn.disabled = false;
    stopBtn.disabled = true;
    manualInput.disabled = false;
    manualInput.value = '';
}

startBtn.addEventListener('click', function () {
    if (timerInterval) return;
    timeUsed = true;
    manualInput.disabled = true;
    manualInput.value = '';
    startBtn.disabled = true;
    stopBtn.disabled = false;


    timerInterval = setInterval(function () {
        seconds++;
        timerDisplay.textContent = formatTime(seconds);

        if (seconds >= MAX_SECONDS) {
            clearInterval(timerInterval);
            timerInterval = null;
            stopBtn.disabled = true;
            alert('3 hour limit reached. your timer has been paused automatically.')
        }
    }, 1000)
})

stopBtn.addEventListener('click', function () {
    clearInterval(timerInterval);
    timerInterval = null;
    stopBtn.disabled = true;
    startBtn.disabled = false;
})

resetTimerBtn.addEventListener('click', function () {
    resetTimer();
})
// RESET BUTTON
resetButton.addEventListener('click', function () {
    localStorage.removeItem('workouts');
    workoutList.innerHTML = '';
});


const savedWorkouts = JSON.parse(localStorage.getItem('workouts')) || [];
displayWorkouts(savedWorkouts);



