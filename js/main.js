function loadGameImage(source) {

    const image = new Image();
    image.src = source;

    return image;
}


const screenImages = {
    initial: loadGameImage("assets/images/imageminicial.jfif"),
    hubBackground: loadGameImage("assets/images/imagemoficial.png"),
    gameOver: loadGameImage("assets/images/gameover.jfif"),
    victory: loadGameImage("assets/images/win.jfif")
};

const introImages = {
    phone: loadGameImage("assets/images/telefone.png"),
    official: loadGameImage("assets/images/imagemoficial.png")
};

let introImageError = null;

for (const [name, image] of Object.entries(introImages)) {
    image.addEventListener("error", () => {
        introImageError = name;
        console.error(`Não foi possível carregar a imagem da introdução: ${image.src}`);
    }, { once: true });
}

const patientMarkerImage =
    loadGameImage("assets/images/paciente-transparente.png");

const explosionSpriteSheet =
    loadGameImage("assets/images/explosao.png");


const levelBackgrounds = levels.map((level) =>
    loadGameImage(level.background)
);

let cleanExplosionSpriteSheet = null;


function isImageReady(image) {

    return image.complete && image.naturalWidth > 0;
}

function getCleanExplosionSpriteSheet() {

    if (!isImageReady(explosionSpriteSheet)) {
        return null;
    }

    if (cleanExplosionSpriteSheet) {
        return cleanExplosionSpriteSheet;
    }

    const cleanedSheet = document.createElement("canvas");
    cleanedSheet.width = explosionSpriteSheet.naturalWidth;
    cleanedSheet.height = explosionSpriteSheet.naturalHeight;

    const cleanedContext = cleanedSheet.getContext("2d");
    cleanedContext.drawImage(explosionSpriteSheet, 0, 0);
    cleanedContext.globalCompositeOperation = "destination-out";

    // Remove as etiquetas numeradas incorporadas ao sprite sheet.
    const labelColumns = [187.5, 527, 868, 1222];
    const labelRows = [311, 622.5, 886, 1088.5];

    for (const x of labelColumns) {
        for (const y of labelRows) {
            cleanedContext.beginPath();
            cleanedContext.roundRect(x - 28, y - 19, 56, 38, 9);
            cleanedContext.fill();
        }
    }

    cleanExplosionSpriteSheet = cleanedSheet;
    return cleanExplosionSpriteSheet;
}


function getCoverImageGeometry(
    image,
    width,
    height,
    sourceRect = {
        x: 0,
        y: 0,
        width: image.naturalWidth,
        height: image.naturalHeight
    }
) {

    const scale = Math.max(
        width / sourceRect.width,
        height / sourceRect.height
    );

    const sourceWidth = width / scale;
    const sourceHeight = height / scale;

    return {
        scale,
        sourceX: sourceRect.x + (sourceRect.width - sourceWidth) / 2,
        sourceY: sourceRect.y + (sourceRect.height - sourceHeight) / 2,
        sourceWidth,
        sourceHeight
    };
}


function drawCoverImage(ctx, image, width, height, sourceRect) {

    const geometry =
        getCoverImageGeometry(image, width, height, sourceRect);

    ctx.drawImage(
        image,
        geometry.sourceX,
        geometry.sourceY,
        geometry.sourceWidth,
        geometry.sourceHeight,
        0,
        0,
        width,
        height
    );
}


function getEndingScreenCrop(image) {

    const topBarHeight = 70;

    return {
        x: 0,
        y: topBarHeight,
        width: image.naturalWidth,
        height: image.naturalHeight - topBarHeight
    };
}


const canvas =
    document.getElementById("gameCanvas");

const ctx =
    canvas.getContext("2d");

const routeBoundaryCanvas = document.createElement("canvas");
routeBoundaryCanvas.width = WORLD_WIDTH;
routeBoundaryCanvas.height = WORLD_HEIGHT;
const routeBoundaryContext =
    routeBoundaryCanvas.getContext("2d");


// ==========================================
// ESTADOS DO JOGO
// ==========================================

const GAME_STATES = {

    INTRO: "intro",

    HUB: "hub",

    PLAYING: "playing",

    EXPLODING: "exploding",

    GAME_OVER: "gameover",

    VICTORY: "victory"

};

const EXPLOSION_DURATION = 700;

let gameState = GAME_STATES.INTRO;
let introStartTime = null;
let introSkipKey = null;

const INTRO_MESSAGE =
    "Emergência, por favor, mande uma ambulância!!!";
const INTRO_MESSAGE_CHARACTERS = Array.from(INTRO_MESSAGE);
const INTRO_PAUSE_AFTER_EMERGENCIA =
    Array.from("Emergência,").length;
const INTRO_TYPEWRITER_INTERVAL = 68;
const INTRO_WORD_PAUSE = 900;
const INTRO_PHONE_HOLD = 2200;
const INTRO_FADE_DURATION = 1800;
const INTRO_BLACK_PAUSE = 450;
const INTRO_OFFICIAL_HOLD = 3000;


function getIntroTypingDuration() {

    return INTRO_MESSAGE_CHARACTERS.length * INTRO_TYPEWRITER_INTERVAL +
        INTRO_WORD_PAUSE;
}


function getContainedImageGeometry(image) {

    const scale = Math.min(
        WORLD_WIDTH / image.naturalWidth,
        WORLD_HEIGHT / image.naturalHeight
    );
    const width = image.naturalWidth * scale;
    const height = image.naturalHeight * scale;

    return {
        x: (WORLD_WIDTH - width) / 2,
        y: (WORLD_HEIGHT - height) / 2,
        width,
        height
    };
}


function drawContainedImage(image) {

    const geometry = getContainedImageGeometry(image);

    ctx.drawImage(
        image,
        geometry.x,
        geometry.y,
        geometry.width,
        geometry.height
    );
}


function drawIntroMessage(elapsed) {

    const pauseStart =
        INTRO_PAUSE_AFTER_EMERGENCIA * INTRO_TYPEWRITER_INTERVAL;
    const charactersBeforePause =
        Math.min(
            INTRO_PAUSE_AFTER_EMERGENCIA,
            Math.floor(elapsed / INTRO_TYPEWRITER_INTERVAL)
        );
    const charactersAfterPause =
        Math.floor(
            Math.max(0, elapsed - pauseStart - INTRO_WORD_PAUSE) /
                INTRO_TYPEWRITER_INTERVAL
        );
    const visibleCharacters =
        elapsed < pauseStart + INTRO_WORD_PAUSE
            ? charactersBeforePause
            : Math.min(
                INTRO_MESSAGE_CHARACTERS.length,
                INTRO_PAUSE_AFTER_EMERGENCIA + charactersAfterPause
            );
    const message =
        INTRO_MESSAGE_CHARACTERS.slice(0, visibleCharacters).join("");

    if (!message) {
        return;
    }

    const phoneGeometry =
        getContainedImageGeometry(introImages.phone);
    const textCenterX =
        phoneGeometry.x + phoneGeometry.width / 2;
    const textCenterY =
        phoneGeometry.y + phoneGeometry.height / 2;
    const maxTextWidth = phoneGeometry.width * 0.88;
    const maxTextHeight = phoneGeometry.height * 0.8;
    let fontSize = Math.min(64, WORLD_WIDTH * 0.05);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `900 ${fontSize}px Georgia, "Times New Roman", serif`;

    const wrapMessage = (text) => {
        const lines = [];
        let line = "";

        for (const word of text.split(" ")) {
            const candidate = line ? `${line} ${word}` : word;

            if (line && ctx.measureText(candidate).width > maxTextWidth) {
                lines.push(line);
                line = word;
            } else {
                line = candidate;
            }
        }

        if (line) {
            lines.push(line);
        }

        return lines;
    };

    let lines = wrapMessage(message);

    while (
        (
            lines.some((line) => ctx.measureText(line).width > maxTextWidth) ||
            lines.length * fontSize * 1.25 > maxTextHeight
        ) &&
        fontSize > 28
    ) {
        fontSize -= 2;
        ctx.font = `900 ${fontSize}px Georgia, "Times New Roman", serif`;
        lines = wrapMessage(message);
    }

    const lineHeight = fontSize * 1.25;
    const firstLineY =
        textCenterY - ((lines.length - 1) * lineHeight) / 2;
    ctx.lineJoin = "round";
    ctx.lineWidth = Math.max(3, fontSize * 0.1);
    ctx.strokeStyle = "rgba(20, 0, 0, 0.95)";
    ctx.shadowColor = "rgba(120, 0, 0, 0.55)";
    ctx.shadowBlur = 10;

    lines.forEach((line, index) => {
        const textY = firstLineY + index * lineHeight;
        ctx.strokeText(line, textCenterX, textY);
        ctx.fillStyle = "#fff";
        ctx.fillText(line, textCenterX, textY);
    });

    ctx.shadowBlur = 0;

    if (visibleCharacters < INTRO_MESSAGE_CHARACTERS.length) {
        const currentLine = lines[lines.length - 1];
        const textY = firstLineY + (lines.length - 1) * lineHeight;
        ctx.fillStyle = "#d71920";
        ctx.fillRect(
            textCenterX + ctx.measureText(currentLine).width / 2 + 8,
            textY - fontSize * 0.42,
            4,
            fontSize * 0.84
        );
    }
}


function drawIntro(timestamp) {

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    if (introImageError) {
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "bold 30px Arial, sans-serif";
        ctx.fillText(
            `Falha ao carregar a imagem "${introImageError}".`,
            WORLD_WIDTH / 2,
            WORLD_HEIGHT / 2 - 24
        );
        ctx.font = "22px Arial, sans-serif";
        ctx.fillText(
            "Pressione ENTER ou ESPAÇO para continuar.",
            WORLD_WIDTH / 2,
            WORLD_HEIGHT / 2 + 24
        );
        return;
    }

    if (
        !isImageReady(introImages.phone) ||
        !isImageReady(introImages.official)
    ) {
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "22px Arial, sans-serif";
        ctx.fillText(
            "Carregando introdução...",
            WORLD_WIDTH / 2,
            WORLD_HEIGHT / 2
        );
        return;
    }

    if (introStartTime === null) {
        introStartTime = timestamp;
    }

    const elapsed = timestamp - introStartTime;
    const typingDuration = getIntroTypingDuration();
    const phoneFadeStart = typingDuration + INTRO_PHONE_HOLD;
    const blackPauseStart = phoneFadeStart + INTRO_FADE_DURATION;
    const officialFadeStart = blackPauseStart + INTRO_BLACK_PAUSE;
    const officialFadeEnd = officialFadeStart + INTRO_FADE_DURATION;
    const officialFadeProgress = Math.min(
        1,
        Math.max(0, (elapsed - officialFadeStart) / INTRO_FADE_DURATION)
    );
    const officialHoldEnd = officialFadeEnd + INTRO_OFFICIAL_HOLD;
    const finalFadeStart = officialHoldEnd;
    const finalFadeEnd = finalFadeStart + INTRO_FADE_DURATION;
    const hubStart = finalFadeEnd + INTRO_BLACK_PAUSE;

    if (elapsed < phoneFadeStart) {
        drawContainedImage(introImages.phone);
        drawIntroMessage(Math.min(elapsed, typingDuration));
    } else if (elapsed < blackPauseStart) {
        drawContainedImage(introImages.phone);
        ctx.fillStyle =
            `rgba(0, 0, 0, ${Math.min(1, (elapsed - phoneFadeStart) / INTRO_FADE_DURATION)})`;
        ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    } else if (elapsed < officialFadeEnd) {
        ctx.globalAlpha = officialFadeProgress;
        drawContainedImage(introImages.official);
        ctx.globalAlpha = 1;
    } else if (elapsed < finalFadeStart) {
        drawContainedImage(introImages.official);
    } else if (elapsed < finalFadeEnd) {
        drawContainedImage(introImages.official);
        ctx.fillStyle =
            `rgba(0, 0, 0, ${(elapsed - finalFadeStart) / INTRO_FADE_DURATION})`;
        ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    }

    if (elapsed >= hubStart) {
        gameState = GAME_STATES.HUB;
    }
}


let currentLevel = 0;

let patientRescued = false;
let sawCollisionTriggered = false;
let explosion = null;


const player = new Player();
const defaultTurnSpeed = player.turnSpeed;


// ==========================================
// INICIAR FASE
// ==========================================

function startLevel(levelIndex) {

    currentLevel = levelIndex;


    const level = levels[currentLevel];
    const route = level.route;
    const firstPoint = route[0];
    const nextPoint = route[1];

    player.speed = level.speed;
    player.turnSpeed = level.turnSpeed || defaultTurnSpeed;
    player.reset(
        level.base.x + level.base.width / 2,
        level.base.y + level.base.height / 2,
        Math.atan2(
            nextPoint.x - firstPoint.x,
            -(nextPoint.y - firstPoint.y)
        )
    );

    patientRescued = false;
    sawCollisionTriggered = false;
    explosion = null;

    gameState = GAME_STATES.PLAYING;
}


// ==========================================
// DESENHAR MAPA
// ==========================================

function drawLevel() {

    const level = levels[currentLevel];


    // ==========================================
    // FUNDO
    // ==========================================

    ctx.fillStyle = "#1c1b1b";
    ctx.fillRect(
        0,
        0,
        WORLD_WIDTH,
        WORLD_HEIGHT
    );

    const background = levelBackgrounds[currentLevel];

    if (isImageReady(background)) {
        drawCoverImage(
            ctx,
            background,
            WORLD_WIDTH,
            WORLD_HEIGHT
        );

        ctx.fillStyle = "rgba(0, 0, 0, 0.22)";
        ctx.fillRect(
            0,
            0,
            WORLD_WIDTH,
            WORLD_HEIGHT
        );
    }


    drawRoute(level);


    // ==========================================
    // SERRAS
    // ==========================================

    level.saws.forEach((saw) => {

        const radius = Math.min(saw.width, saw.height) / 2;
        const toothCount = 12;

        ctx.save();
        ctx.translate(saw.x, saw.y);

        ctx.beginPath();

        for (let tooth = 0; tooth < toothCount * 2; tooth++) {
            const angle =
                tooth * Math.PI / toothCount - Math.PI / 2;
            const toothRadius =
                tooth % 2 === 0 ? radius : radius * 0.78;
            const x = Math.cos(angle) * toothRadius;
            const y = Math.sin(angle) * toothRadius;

            if (tooth === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }

        ctx.closePath();
        ctx.fillStyle = "#77716a";
        ctx.strokeStyle = "#292426";
        ctx.lineWidth = 4;
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.48, 0, Math.PI * 2);
        ctx.fillStyle = "#493536";
        ctx.fill();
        ctx.strokeStyle = "#b14a46";
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.16, 0, Math.PI * 2);
        ctx.fillStyle = "#c05a50";
        ctx.fill();

        ctx.restore();

    });


    // ==========================================
    // BASE E PACIENTE
    // ==========================================

    drawObjectiveMarker(ctx, level.base, "BASE", "#d6a84e");

    if (!patientRescued) {
        drawPatientMarker(ctx, level.patient);
    }

    ctx.fillStyle = "rgba(0, 0, 0, 0.68)";
    ctx.fillRect(690, 20, 420, 46);
    ctx.fillStyle = "#f1e8db";
    ctx.font = "bold 22px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
        patientRescued
            ? "RESGATE FEITO — RETORNE À BASE"
            : "IDA — ENCONTRE O PACIENTE",
        WORLD_WIDTH / 2,
        43
    );
}


function drawRoute(level) {

    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (currentLevel === 1) {
        drawRouteBoundaryBand(
            level.route,
            level.laneWidth,
            level.laneWidth - 6,
            "rgba(22, 20, 22, 0.95)"
        );
        drawRouteBoundaryBand(
            level.route,
            level.laneWidth - 6,
            level.laneWidth - 10,
            "rgba(201, 105, 76, 0.95)"
        );

        traceRoutePolyline(ctx, level.route);
        ctx.strokeStyle = "rgba(235, 220, 192, 0.92)";
        ctx.lineWidth = 3;
        ctx.setLineDash([24, 22]);
        ctx.stroke();
        ctx.restore();

        return;
    }

    const traceRoute = (points) => {
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);

        if (points.length === 2) {
            ctx.lineTo(points[1].x, points[1].y);
            return;
        }

        for (let i = 1; i < points.length - 1; i++) {
            const midpoint = {
                x: (points[i].x + points[i + 1].x) / 2,
                y: (points[i].y + points[i + 1].y) / 2
            };
            ctx.quadraticCurveTo(
                points[i].x,
                points[i].y,
                midpoint.x,
                midpoint.y
            );
        }

        const lastPoint = points[points.length - 1];
        ctx.lineTo(lastPoint.x, lastPoint.y);
    };

    traceRoute(level.route);
    ctx.strokeStyle = "rgba(25, 26, 29, 0.2)";
    ctx.lineWidth = level.laneWidth - 4;
    ctx.stroke();

    for (const side of [-1, 1]) {
        const boundary = getOffsetRoute(
            level.route,
            side * level.laneWidth / 2
        );

        traceRoute(boundary);

        ctx.strokeStyle = "rgba(22, 20, 22, 0.9)";
        ctx.lineWidth = 8;
        ctx.stroke();

        ctx.strokeStyle = "rgba(171, 66, 59, 0.68)";
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    traceRoute(level.route);
    ctx.strokeStyle = "rgba(211, 196, 169, 0.42)";
    ctx.lineWidth = 3;
    ctx.setLineDash([24, 22]);
    ctx.stroke();

    ctx.restore();
}

function traceRoutePolyline(context, route) {
    context.beginPath();
    context.moveTo(route[0].x, route[0].y);

    for (let i = 1; i < route.length; i++) {
        context.lineTo(route[i].x, route[i].y);
    }
}

function drawRouteBoundaryBand(route, outerWidth, innerWidth, color) {
    routeBoundaryContext.clearRect(
        0,
        0,
        WORLD_WIDTH,
        WORLD_HEIGHT
    );
    routeBoundaryContext.save();
    routeBoundaryContext.lineCap = "round";
    routeBoundaryContext.lineJoin = "round";
    routeBoundaryContext.strokeStyle = color;
    routeBoundaryContext.lineWidth = outerWidth;
    traceRoutePolyline(routeBoundaryContext, route);
    routeBoundaryContext.stroke();

    routeBoundaryContext.globalCompositeOperation = "destination-out";
    routeBoundaryContext.lineWidth = innerWidth;
    traceRoutePolyline(routeBoundaryContext, route);
    routeBoundaryContext.stroke();
    routeBoundaryContext.restore();

    ctx.drawImage(routeBoundaryCanvas, 0, 0);
}


function getOffsetRoute(route, offset) {

    return route.map((point, index) => {
        const previous = route[Math.max(0, index - 1)];
        const next = route[Math.min(route.length - 1, index + 1)];
        const tangentX = next.x - previous.x;
        const tangentY = next.y - previous.y;
        const tangentLength =
            Math.hypot(tangentX, tangentY) || 1;
        const normalX = -tangentY / tangentLength;
        const normalY = tangentX / tangentLength;

        return {
            x: point.x + normalX * offset,
            y: point.y + normalY * offset
        };
    });
}


function drawObjectiveMarker(ctx, marker, label, color) {

    const x = marker.x + marker.width / 2;
    const y = marker.y + marker.height / 2;

    ctx.save();
    ctx.translate(x, y);

    ctx.beginPath();
    ctx.arc(0, 0, 25, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(15, 15, 17, 0.85)";
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.fillRect(-4, -14, 8, 28);
    ctx.fillRect(-14, -4, 28, 8);

    ctx.restore();

    ctx.fillStyle = "#fff1dc";
    ctx.font = "bold 16px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(label, x, y + 30);
}


function drawPatientMarker(ctx, marker) {

    const x = marker.x + marker.width / 2;
    const y = marker.y + marker.height / 2;
    const size = Math.min(marker.width, marker.height) + 4;

    if (isImageReady(patientMarkerImage)) {
        ctx.drawImage(
            patientMarkerImage,
            x - size / 2,
            y - size / 2,
            size,
            size
        );
    }

    ctx.fillStyle = "#fff1dc";
    ctx.font = "bold 16px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText("PACIENTE", x, y + size / 2 + 2);
}


// ==========================================
// COLISÃO COM SERRA E EXPLOSÃO
// ==========================================

function startExplosion(timestamp) {

    if (
        gameState !== GAME_STATES.PLAYING ||
        sawCollisionTriggered
    ) {

        return;
    }

    sawCollisionTriggered = true;
    player.direction.left = false;
    player.direction.right = false;
    explosion = {
        x: player.x,
        y: player.y,
        startTime: timestamp
    };

    gameState = GAME_STATES.EXPLODING;


    playCrashSound();
}


// ==========================================
// CONCLUIR FASE
// ==========================================

function completeLevel() {

    if (!patientRescued) {
        return;
    }

    // ========================================================
    // MARCA A FASE ATUAL COMO CONCLUÍDA
    // ========================================================

    completedLevels[currentLevel] = true;


    gameState =
        GAME_STATES.VICTORY;

    playVictorySound();
}


// ==========================================
// ATUALIZAR JOGO
// ==========================================

function updateGame(timestamp) {

    if (
        gameState !== GAME_STATES.PLAYING
    ) {

        return;
    }


    // --------------------------------------------------------
    // MOVIMENTO
    // --------------------------------------------------------

    player.update();


    // --------------------------------------------------------
    // SERRAS
    // --------------------------------------------------------
    //
    // A serra é letal.
    // --------------------------------------------------------

    if (
        checkSawCollision(player)
    ) {

        startExplosion(timestamp);

        return;
    }


    // --------------------------------------------------------
    // RESGATE E RETORNO À BASE
    // --------------------------------------------------------

    if (
        checkGoalCollision(
            player,
            patientRescued
                ? levels[currentLevel].base
                : levels[currentLevel].patient
        )
    ) {

        if (patientRescued) {
            completeLevel();
        } else {
            const route = levels[currentLevel].route;
            const lastPoint = route[route.length - 1];
            const previousPoint = route[route.length - 2];

            patientRescued = true;
            player.x =
                levels[currentLevel].patient.x +
                levels[currentLevel].patient.width / 2;
            player.y =
                levels[currentLevel].patient.y +
                levels[currentLevel].patient.height / 2;
            player.angle = Math.atan2(
                previousPoint.x - lastPoint.x,
                -(previousPoint.y - lastPoint.y)
            );
            player.direction.left = false;
            player.direction.right = false;
        }

        return;
    }
}

function updateExplosion(timestamp) {

    if (!explosion) {
        return;
    }

    if (timestamp - explosion.startTime >= EXPLOSION_DURATION) {
        explosion = null;
        gameState = GAME_STATES.GAME_OVER;
    }
}


function drawExplosion(timestamp) {

    if (!explosion) {
        return;
    }

    const spriteSheet = getCleanExplosionSpriteSheet();

    if (!spriteSheet) {
        return;
    }

    const progress = Math.min(
        (timestamp - explosion.startTime) / EXPLOSION_DURATION,
        1
    );
    const columns = 4;
    const rows = 4;
    const frameCount = columns * rows;
    const frameIndex = Math.min(
        Math.floor(progress * frameCount),
        frameCount - 1
    );
    const frameWidth = spriteSheet.width / columns;
    const frameHeight = spriteSheet.height / rows;
    const sourceX = (frameIndex % columns) * frameWidth;
    const sourceY = Math.floor(frameIndex / columns) * frameHeight;
    const drawWidth = 180;
    const drawHeight = drawWidth * frameHeight / frameWidth;

    ctx.drawImage(
        spriteSheet,
        sourceX,
        sourceY,
        frameWidth,
        frameHeight,
        explosion.x - drawWidth / 2,
        explosion.y - drawHeight / 2,
        drawWidth,
        drawHeight
    );
}


// ==========================================
// DESENHAR GAME OVER
// ==========================================

function drawGameOver() {

    if (isImageReady(screenImages.gameOver)) {
        drawCoverImage(
            ctx,
            screenImages.gameOver,
            canvas.width,
            canvas.height,
            getEndingScreenCrop(screenImages.gameOver)
        );

        return;
    }


    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    ctx.textAlign = "center";

    ctx.fillStyle = "#e74c3c";

    ctx.font = "60px Arial";

    ctx.fillText(
        "GAME OVER",
        canvas.width / 2,
        250
    );


    ctx.fillStyle = "white";

    ctx.font = "25px Arial";

    ctx.fillText(
        "Você passou por cima de uma serra!",
        canvas.width / 2,
        310
    );


    ctx.fillText(
        "Pressione R para tentar novamente",
        canvas.width / 2,
        370
    );
}


// ==========================================
// VITÓRIA FINAL
// ==========================================

function drawVictory() {

    if (isImageReady(screenImages.victory)) {
        drawCoverImage(
            ctx,
            screenImages.victory,
            canvas.width,
            canvas.height,
            getEndingScreenCrop(screenImages.victory)
        );

        return;
    }


    ctx.fillStyle = "#111";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    ctx.fillStyle = "#2ecc71";

    ctx.textAlign = "center";

    ctx.font = "60px Arial";

    ctx.fillText(
        "PARABÉNS!",
        canvas.width / 2,
        250
    );


    ctx.fillStyle = "white";

    ctx.font = "25px Arial";

    ctx.fillText(
        "Você concluiu a missão!",
        canvas.width / 2,
        320
    );


    ctx.font = "18px Arial";

    ctx.fillText(
        "Pressione ENTER para voltar ao Hub",
        canvas.width / 2,
        380
    );
}

// ============================================================
// CONTROLES GERAIS DO JOGO
// ============================================================

document.addEventListener("keydown", (event) => {

    if (event.repeat && introSkipKey === event.code) {
        event.preventDefault();
        return;
    }

    // Evita que algumas teclas gerem comportamentos duplicados.
    if (
        event.key === "ArrowLeft" ||
        event.key === "ArrowRight" ||
        event.key === "ArrowUp" ||
        event.key === "ArrowDown" ||
        event.key === "Enter" ||
        event.code === "Space" ||
        event.key.toLowerCase() === "r"
    ) {

        event.preventDefault();
    }


    if (
        gameState === GAME_STATES.INTRO &&
        (
            event.key === "Enter" ||
            event.code === "Space"
        )
    ) {
        introSkipKey = event.code;
        gameState = GAME_STATES.HUB;
        return;
    }


    // ========================================================
    // R = REINICIAR
    // ========================================================
    //
    // Agora R funciona independentemente de o carro estar:
    //
    // - vivo
    // - morto
    //
    // Não funciona no HUB porque lá não existe uma fase
    // acontecendo.
    // ========================================================

    if (
        event.key.toLowerCase() === "r" &&
        (
            gameState === GAME_STATES.PLAYING ||
            gameState === GAME_STATES.GAME_OVER
        )
    ) {

        startLevel(currentLevel);

        return;
    }


    // ========================================================
    // ENTER NA TELA DE VITÓRIA
    // ========================================================
    //
    // Depois de completar as três fases:
    //
    // VICTORY
    //    ↓ ENTER
    // HUB
    //
    // As três fases continuarão verdes.
    // ========================================================

    if (
        gameState === GAME_STATES.VICTORY &&
        event.key === "Enter"
    ) {

        gameState = GAME_STATES.HUB;

        return;
    }


    // ========================================================
    // CONTROLES DO HUB
    // ========================================================

    if (
        gameState === GAME_STATES.HUB
    ) {

        handleHubInput(event);

        return;
    }


    // ========================================================
    // CONTROLES DURANTE A FASE
    // ========================================================

    if (
        gameState === GAME_STATES.PLAYING
    ) {

        // Virar para a esquerda
        if (
            event.key === "ArrowLeft" ||
            event.key.toLowerCase() === "a"
        ) {

            player.direction.left = true;
        }


        // Virar para a direita
        if (
            event.key === "ArrowRight" ||
            event.key.toLowerCase() === "d"
        ) {

            player.direction.right = true;
        }
    }
});


// ============================================================
// SOLTAR TECLAS
// ============================================================

document.addEventListener("keyup", (event) => {

    if (introSkipKey === event.code) {
        introSkipKey = null;
    }

    if (
        event.key === "ArrowLeft" ||
        event.key.toLowerCase() === "a"
    ) {

        player.direction.left = false;
    }


    if (
        event.key === "ArrowRight" ||
        event.key.toLowerCase() === "d"
    ) {

        player.direction.right = false;
    }
});


function handleScreenClick(event) {

    if (
        gameState !== GAME_STATES.GAME_OVER &&
        gameState !== GAME_STATES.VICTORY
    ) {
        return;
    }

    const image =
        gameState === GAME_STATES.GAME_OVER
            ? screenImages.gameOver
            : screenImages.victory;

    if (!isImageReady(image)) {
        return;
    }

    const bounds = canvas.getBoundingClientRect();
    const canvasX =
        (event.clientX - bounds.left) * canvas.width / bounds.width;
    const canvasY =
        (event.clientY - bounds.top) * canvas.height / bounds.height;

    const geometry =
        getCoverImageGeometry(
            image,
            canvas.width,
            canvas.height,
            getEndingScreenCrop(image)
        );

    const imageX =
        geometry.sourceX + canvasX / geometry.scale;
    const imageY =
        geometry.sourceY + canvasY / geometry.scale;

    const clicked = (x, y, width, height) =>
        imageX >= x &&
        imageX <= x + width &&
        imageY >= y &&
        imageY <= y + height;

    if (gameState === GAME_STATES.GAME_OVER) {

        if (clicked(510, 450, 275, 155)) {
            startLevel(currentLevel);
        } else if (clicked(795, 450, 285, 155)) {
            gameState = GAME_STATES.HUB;
        }

        return;
    }

    if (clicked(465, 535, 210, 125)) {
        const nextLevel = (currentLevel + 1) % levels.length;
        selectedLevel = nextLevel;
        startLevel(nextLevel);
    } else if (clicked(695, 535, 210, 125)) {
        startLevel(currentLevel);
    } else if (clicked(930, 535, 200, 125)) {
        gameState = GAME_STATES.HUB;
    }
}


canvas.addEventListener("click", handleScreenClick);


// ==========================================
// LOOP PRINCIPAL
// ==========================================

function gameLoop(timestamp = performance.now()) {

    // Limpa a tela.

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // ==========================================
    // HUB
    // ==========================================

    if (gameState === GAME_STATES.INTRO) {

        drawIntro(timestamp);

    }


    else if (gameState === GAME_STATES.HUB) {

        drawHub(ctx);

    }


    // ==========================================
    // FASE
    // ==========================================

    else if (
        gameState === GAME_STATES.PLAYING
    ) {

        updateGame(timestamp);

        drawLevel();

        player.draw(ctx);

    }

    else if (
        gameState === GAME_STATES.EXPLODING
    ) {

        updateExplosion(timestamp);

        drawLevel();

        player.draw(ctx);

        if (gameState === GAME_STATES.GAME_OVER) {
            drawGameOver();
        } else {
            drawExplosion(timestamp);
        }

    }


    // ==========================================
    // GAME OVER
    // ==========================================

    else if (
        gameState === GAME_STATES.GAME_OVER
    ) {

        drawLevel();

        player.draw(ctx);

        drawGameOver();

    }


    // ==========================================
    // VITÓRIA
    // ==========================================

    else if (
        gameState === GAME_STATES.VICTORY
    ) {

        drawVictory();

    }


    requestAnimationFrame(gameLoop);
}


// ==========================================
// COMEÇAR
// ==========================================

gameLoop();