
 // ============================================================
 // SISTEMA DE ÁUDIO — LAST CALL
 // ============================================================


// ============================================================
// SONS EXISTENTES
// ============================================================

const crashSound = new Audio("assets/audio/crash.mp3");
const victorySound = new Audio("assets/audio/victory.mp3");


const engineSound = new Audio("assets/audio/engine.mp3");

engineSound.loop = true;
engineSound.volume = 0.5;

function startEngineSound() {
    if (engineSound.paused) {
        playAudioSafely(engineSound);
    }
}

function stopEngineSound() {
    engineSound.pause();
    engineSound.currentTime = 0;
}

// ============================================================
// MÚSICA DE FUNDO
// ============================================================

const backgroundMusic = new Audio("assets/audio/menu.mp3");

backgroundMusic.loop = true;
backgroundMusic.volume = 0.25;


// ============================================================
// TELEFONE ANTIGO DA INTRODUÇÃO
// ============================================================

const phoneRingSound = new Audio("assets/audio/phone.mp3");

phoneRingSound.volume = 0.8;

let phoneRingRequested = false;
let phoneRingPlayed = false;


// ============================================================
// FUNÇÃO AUXILIAR PARA REPRODUZIR ÁUDIO
// ============================================================

function playAudioSafely(audio, restart = false) {
    if (restart) {
        audio.currentTime = 0;
    }

    const playPromise = audio.play();

    if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch((error) => {
            console.warn("Não foi possível reproduzir o áudio:", error);
        });
    }
}


// ============================================================
// INICIAR MÚSICA DE FUNDO
// ============================================================

function startBackgroundMusic() {
    if (!backgroundMusic.paused) {
        return;
    }

    playAudioSafely(backgroundMusic);
}


// ============================================================
// PARAR MÚSICA DE FUNDO
// ============================================================

function stopBackgroundMusic() {
    backgroundMusic.pause();
}


// ============================================================
// TOCAR TELEFONE UMA ÚNICA VEZ
// ============================================================

function playPhoneRing() {
    if (phoneRingPlayed || phoneRingRequested) {
        return;
    }

    phoneRingRequested = true;
    phoneRingSound.currentTime = 0;

    const playPromise = phoneRingSound.play();

    if (playPromise && typeof playPromise.then === "function") {
        playPromise
            .then(() => {
                phoneRingPlayed = true;
                phoneRingRequested = false;
            })
            .catch((error) => {
                phoneRingRequested = false;

                console.warn(
                    "Não foi possível reproduzir o toque do telefone:",
                    error
                );
            });
    } else {
        phoneRingPlayed = true;
        phoneRingRequested = false;
    }
}


// ============================================================
// ÁUDIO DA INTRODUÇÃO
// ============================================================

function startIntroAudio() {
    startBackgroundMusic();
    playPhoneRing();
}


// ============================================================
// SONS DE COLISÃO E VITÓRIA
// ============================================================

function playCrashSound() {
    playAudioSafely(crashSound, true);
}


function playVictorySound() {
    playAudioSafely(victorySound, true);
}


// ============================================================
// LIBERAR ÁUDIO APÓS INTERAÇÃO DO JOGADOR
// ============================================================
//
// Alguns navegadores bloqueiam áudio automático.
// A primeira interação permite tentar reproduzi-lo novamente.
// ============================================================

let firstAudioGestureHandled = false;

function handleFirstAudioGesture(event) {
    if (firstAudioGestureHandled) {
        return;
    }

    firstAudioGestureHandled = true;

    const isSkippingIntro =
        event.type === "keydown" &&
        (
            event.key === "Enter" ||
            event.code === "Space"
        );

    if (
        typeof gameState !== "undefined" &&
        gameState === "intro" &&
        !isSkippingIntro
    ) {
        startIntroAudio();
    } else {
        startBackgroundMusic();
    }
}

document.addEventListener(
    "pointerdown",
    handleFirstAudioGesture
);

document.addEventListener(
    "keydown",
    handleFirstAudioGesture
);
