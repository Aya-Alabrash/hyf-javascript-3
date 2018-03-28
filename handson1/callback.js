'use strict';
function timerStop() {
    console.log('timer stopped');
}

function startTimer(duration, cb) {
    console.log('timer started');
    setTimeout(cb, duration);
}

startTimer(2000, timerStop);
