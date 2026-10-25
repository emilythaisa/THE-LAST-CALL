const crashSound = new Audio(
    "assets/audio/crash.mp3"
);


const victorySound = new Audio(
    "assets/audio/victory.mp3"
);


function playCrashSound() {

    crashSound.currentTime = 0;

    crashSound.play();

}


function playVictorySound() {

    victorySound.currentTime = 0;

    victorySound.play();

}