// ============================================================
// HUB / MENU PRINCIPAL
// ============================================================

// Guarda quais fases já foram concluídas.
// false = ainda não concluída
// true  = concluída
let completedLevels = [false, false, false];

// Fase atualmente selecionada no HUB
let selectedLevel = 0;


// ============================================================
// DESENHA O HUB
// ============================================================

function drawHub(ctx) {

    // Fundo geral
    ctx.fillStyle = "#111111";
    ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    if (isImageReady(screenImages.hubBackground)) {
        drawCoverImage(
            ctx,
            screenImages.hubBackground,
            WORLD_WIDTH,
            WORLD_HEIGHT
        );

        ctx.fillStyle = "rgba(0, 0, 0, 0.58)";
        ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    }


    // --------------------------------------------------------
    // TÍTULO
    // --------------------------------------------------------

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "rgba(0, 0, 0, 0.95)";
    ctx.shadowBlur = 6;

    if (!isImageReady(screenImages.hubBackground)) {
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 54px Arial";
        ctx.fillText(
            "LAST CALL",
            WORLD_WIDTH / 2,
            90
        );
    }

    ctx.font = "24px Arial";
    ctx.fillStyle = "#aaaaaa";

    ctx.fillText(
        "SELECIONE UMA FASE",
        WORLD_WIDTH / 2,
        140
    );


    // --------------------------------------------------------
    // CONFIGURAÇÃO DOS CARTÕES
    // --------------------------------------------------------

    const cardWidth = 420;
    const cardHeight = 300;

    const gap = 45;

    const totalWidth =
        cardWidth * 3 + gap * 2;

    const startX =
        (WORLD_WIDTH - totalWidth) / 2;

    const startY = 250;


    // --------------------------------------------------------
    // DESENHA AS 3 FASES
    // --------------------------------------------------------

    for (let i = 0; i < 3; i++) {

        const x = startX + i * (cardWidth + gap);
        const y = startY;

        const isSelected = i === selectedLevel;
        const isCompleted = completedLevels[i];


        // ----------------------------------------------------
        // PRÉVIA DO CENÁRIO
        // ----------------------------------------------------

        drawRoundedRect(
            ctx,
            x,
            y,
            cardWidth,
            cardHeight,
            20
        );

        ctx.save();
        ctx.clip();

        const previewImage = levelBackgrounds[i];

        if (isImageReady(previewImage)) {
            const imageGeometry =
                getCoverImageGeometry(previewImage, cardWidth, cardHeight);

            ctx.drawImage(
                previewImage,
                imageGeometry.sourceX,
                imageGeometry.sourceY,
                imageGeometry.sourceWidth,
                imageGeometry.sourceHeight,
                x,
                y,
                cardWidth,
                cardHeight
            );
        } else {
            ctx.fillStyle = isCompleted ? "#173d25" : "#292929";
            ctx.fillRect(x, y, cardWidth, cardHeight);
        }

        ctx.fillStyle = isCompleted
            ? "rgba(0, 35, 12, 0.4)"
            : "rgba(0, 0, 0, 0.3)";
        ctx.fillRect(x, y, cardWidth, cardHeight);
        ctx.restore();


        // ----------------------------------------------------
        // BORDA
        // ----------------------------------------------------

        if (isSelected) {

            // Fase atualmente selecionada
            ctx.strokeStyle = "#ffd000";
            ctx.lineWidth = 5;

        } else if (isCompleted) {

            // Fase concluída
            ctx.strokeStyle = "#31c95b";
            ctx.lineWidth = 4;

        } else {

            ctx.strokeStyle = "#555555";
            ctx.lineWidth = 3;
        }


        drawRoundedRect(
            ctx,
            x,
            y,
            cardWidth,
            cardHeight,
            20
        );

        ctx.stroke();


        // ----------------------------------------------------
        // NÚMERO DA FASE
        // ----------------------------------------------------

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 38px Arial";

        ctx.fillText(
            `FASE ${i + 1}`,
            x + cardWidth / 2,
            y + 65
        );


        // ----------------------------------------------------
        // DESCRIÇÃO
        // ----------------------------------------------------

        ctx.font = "22px Arial";

        if (i === 0) {

            ctx.fillStyle = "#cccccc";

            ctx.fillText(
                "INTRODUÇÃO",
                x + cardWidth / 2,
                y + 125
            );

        } else if (i === 1) {

            ctx.fillStyle = "#cccccc";

            ctx.fillText(
                "DESAFIO MÉDIO",
                x + cardWidth / 2,
                y + 125
            );

        } else {

            ctx.fillStyle = "#cccccc";

            ctx.fillText(
                "DESAFIO EXTREMO",
                x + cardWidth / 2,
                y + 125
            );
        }


        // ----------------------------------------------------
        // STATUS
        // ----------------------------------------------------

        if (isCompleted) {

            ctx.fillStyle = "#31c95b";
            ctx.font = "bold 24px Arial";

            ctx.fillText(
                "✓ CONCLUÍDA",
                x + cardWidth / 2,
                y + 190
            );

        } else {

            ctx.fillStyle = "#888888";
            ctx.font = "20px Arial";

            ctx.fillText(
                "NÃO CONCLUÍDA",
                x + cardWidth / 2,
                y + 190
            );
        }


        // ----------------------------------------------------
        // INDICADOR DA FASE SELECIONADA
        // ----------------------------------------------------

        if (isSelected) {

            ctx.fillStyle = "#ffd000";
            ctx.font = "bold 18px Arial";

            ctx.fillText(
                "PRESSIONE ENTER",
                x + cardWidth / 2,
                y + 245
            );
        }

        ctx.shadowBlur = 0;
    }


    // --------------------------------------------------------
    // INSTRUÇÕES
    // --------------------------------------------------------

    ctx.fillStyle = "#999999";
    ctx.font = "20px Arial";

    ctx.fillText(
        "← →  Selecionar fase",
        WORLD_WIDTH / 2 - 180,
        710
    );

    ctx.fillText(
        "ENTER  Iniciar",
        WORLD_WIDTH / 2 + 180,
        710
    );
}


// ============================================================
// RETÂNGULO COM CANTOS ARREDONDADOS
// ============================================================

function drawRoundedRect(
    ctx,
    x,
    y,
    width,
    height,
    radius
) {

    ctx.beginPath();

    ctx.moveTo(
        x + radius,
        y
    );

    ctx.lineTo(
        x + width - radius,
        y
    );

    ctx.quadraticCurveTo(
        x + width,
        y,
        x + width,
        y + radius
    );

    ctx.lineTo(
        x + width,
        y + height - radius
    );

    ctx.quadraticCurveTo(
        x + width,
        y + height,
        x + width - radius,
        y + height
    );

    ctx.lineTo(
        x + radius,
        y + height
    );

    ctx.quadraticCurveTo(
        x,
        y + height,
        x,
        y + height - radius
    );

    ctx.lineTo(
        x,
        y + radius
    );

    ctx.quadraticCurveTo(
        x,
        y,
        x + radius,
        y
    );

    ctx.closePath();
}


// ============================================================
// CONTROLES DO HUB
// ============================================================

function handleHubInput(event) {

    if (event.key === "ArrowLeft") {

        selectedLevel--;

        if (selectedLevel < 0) {
            selectedLevel = 2;
        }
    }


    if (event.key === "ArrowRight") {

        selectedLevel++;

        if (selectedLevel > 2) {
            selectedLevel = 0;
        }
    }


    if (event.key === "Enter") {

        startLevel(selectedLevel);
    }
}