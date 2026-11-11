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
        ctx.font = "bold 54px 'Arial Black', Impact, sans-serif";
        ctx.fillText(
            "LAST CALL",
            WORLD_WIDTH / 2,
            90
        );
    }

    ctx.font = "24px 'Arial Black', Impact, sans-serif";
    ctx.fillStyle = "#aaaaaa";

    ctx.fillText(
        "",
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
        drawRoundedRect(ctx, x, y, cardWidth, cardHeight, 15);

        ctx.save();
        ctx.clip();

        const previewImage = levelBackgrounds[i];

        if (isImageReady(previewImage)) {
            const imageGeometry = getCoverImageGeometry(previewImage, cardWidth, cardHeight);
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
            ctx.fillStyle = isCompleted ? "#173d25" : "#1a1a1a";
            ctx.fillRect(x, y, cardWidth, cardHeight);
        }

        // DEGRADÊ SOBRE O CARTÃO (Transparente em cima, escuro embaixo para o texto)
        const gradient = ctx.createLinearGradient(x, y, x, y + cardHeight);
        gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
        gradient.addColorStop(0.4, "rgba(0, 0, 0, 0.2)");
        gradient.addColorStop(1, isCompleted ? "rgba(0, 35, 12, 0.95)" : "rgba(0, 0, 0, 0.95)");
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, cardWidth, cardHeight);
        ctx.restore();


        // ----------------------------------------------------
        // BORDA COM GLOW (Brilho)
        // ----------------------------------------------------
        if (isSelected) {
            ctx.strokeStyle = "#e5a939"; // Amarelo/Dourado do logo
            ctx.lineWidth = 6;
            ctx.shadowColor = "#e5a939";
            ctx.shadowBlur = 15; // Efeito de brilho neon
        } else if (isCompleted) {
            ctx.strokeStyle = "#258f43";
            ctx.lineWidth = 4;
            ctx.shadowBlur = 0;
        } else {
            ctx.strokeStyle = "#333333";
            ctx.lineWidth = 3;
            ctx.shadowBlur = 0;
        }

        drawRoundedRect(ctx, x, y, cardWidth, cardHeight, 15);
        ctx.stroke();
        ctx.shadowBlur = 0; // Reseta a sombra para não bugar o resto


        // ----------------------------------------------------
        // TEXTOS DO CARTÃO
        // ----------------------------------------------------
        const titles = ["INTRODUÇÃO", "DESAFIO MÉDIO", "DESAFIO EXTREMO"];
        const title = titles[i];

        ctx.textAlign = "center";
        ctx.shadowColor = "#000000";
        ctx.shadowBlur = 6;

        // Título da fase (Movido para baixo)
        ctx.fillStyle = isSelected ? "#e5a939" : "#ffffff";
        ctx.font = "900 32px 'Arial Black', Impact, sans-serif";
        ctx.fillText(title, x + cardWidth / 2, y + cardHeight - 65);

        // Indicador de status (Pressione Enter ou Concluída)
        if (isSelected) {
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 18px 'Arial Black', Impact, sans-serif";
            ctx.fillText("▶ PRESSIONE ENTER ◀", x + cardWidth / 2, y + cardHeight - 25);
        } else if (isCompleted) {
            ctx.fillStyle = "#31c95b";
            ctx.font = "bold 18px 'Arial Black', Impact, sans-serif";
            ctx.fillText("CONCLUÍDA", x + cardWidth / 2, y + cardHeight - 25);
        }

        ctx.shadowBlur = 0; // Reseta a sombra
    }


    // --------------------------------------------------------
    // INSTRUÇÕES GERAIS (Rodapé)
    // --------------------------------------------------------
    ctx.fillStyle = "#bbbbbb";
    ctx.font = "bold 20px 'Arial Black', Impact, sans-serif";
    ctx.shadowColor = "#000000";
    ctx.shadowBlur = 8;
    ctx.textAlign = "center";

    ctx.fillText("← →  SELECIONAR FASE", WORLD_WIDTH / 2 - 220, 740);
    ctx.fillText("ENTER  INICIAR", WORLD_WIDTH / 2 + 220, 740);

    ctx.shadowBlur = 0;
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
