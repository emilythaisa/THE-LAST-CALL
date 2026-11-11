const WORLD_WIDTH = 1800;
const WORLD_HEIGHT = 800;


// ==================================================
// CONFIGURAÇÃO DAS FASES
// ==================================================

const levels = [

    // ==================================================
    // FASE 1
    // ==================================================

    {
        name: "Primeiros Socorros",
        background: "assets/images/cenariofase1.jfif",

        // Velocidade da ambulância nessa fase.
        speed: 5,
        laneWidth: 210,


        // ------------------------------------------
        // PERCURSO E LIMITES LATERAIS
        // ------------------------------------------

        // ------------------------------------------
        // PERCURSO
        // ------------------------------------------

        route: [
            { x: 80, y: 590 },
            { x: 210, y: 590 },
            { x: 340, y: 545 },
            { x: 440, y: 470 },
            { x: 500, y: 360 },
            { x: 600, y: 285 },
            { x: 720, y: 290 },
            { x: 840, y: 350 },
            { x: 960, y: 440 },
            { x: 1080, y: 500 },
            { x: 1210, y: 470 },
            { x: 1330, y: 370 },
            { x: 1430, y: 280 },
            { x: 1580, y: 220 },
            { x: 1720, y: 210 }
        ],


        // ------------------------------------------
        // SERRAS
        // ------------------------------------------

        saws: [

            {
                x: 560,
                y: 320,
                width: 60,
                height: 60
            },

            {
                x: 1040,
                y: 545,
                width: 60,
                height: 60
            }

        ],


        // ------------------------------------------
        // OBJETIVO
        // ------------------------------------------

        base: { x: 44, y: 554, width: 72, height: 72 },
        patient: { x: 1684, y: 174, width: 72, height: 72 }

    },


    // ==================================================
    // FASE 2
    // ==================================================

    
{
    name: "Emergência",
    background: "assets/images/cenariofase2.png",

    speed: 7,
    laneWidth: 210,


    
        route: [
            // Início: subida pela lateral esquerda
            { x: 80,   y: 80 },
            { x: 80,   y: 300 },
            { x: 100,  y: 570 },

            // Curva inferior esquerda
            { x: 220,  y: 650 },
            { x: 450,  y: 680 },
            { x: 650,  y: 680 },

            // Grande curva para cima
            { x: 780,  y: 610 },
            { x: 800,  y: 430 },
            { x: 800,  y: 300 },

            // Curva central superior
            { x: 900,  y: 250 },
            { x: 1080, y: 270 },
            { x: 1180, y: 350 },

            // Curva longa à direita
            { x: 1300, y: 450 },
            { x: 1450, y: 500 },
            { x: 1550, y: 430 },

            // Trecho final
            { x: 1660, y: 350 },
            { x: 1710, y: 350 }
        ],


            
        saws: [
            // Curva inferior esquerda
            {
                x: 125,
                y: 570,
                width: 60,
                height: 60
            },

            // Curva na parte inferior central
            {
                x: 650,
                y: 680,
                width: 60,
                height: 60
            },

            // Curva superior central
            {
                x: 900,
                y: 250,
                width: 60,
                height: 60
            },

            // Curva do lado direito
            {
                x: 1450,
                y: 500,
                width: 60,
                height: 60
            }
        ],

        base: {
            x: 44,
            y: 44,
            width: 72,
            height: 72
        },

        patient: {
            x: 1665,
            y: 305,
            width: 72,
            height: 72
        }

},



    // ==================================================
    // FASE 3
    // ==================================================

    {
        name: "Emergência Máxima",
        background: "assets/images/cenariofase3.jfif",

        speed: 8,
        laneWidth: 210,


        route: [
            { x: 65, y: 600 },
            { x: 220, y: 600 },
            { x: 370, y: 600 },
            { x: 470, y: 560 },
            { x: 520, y: 480 },
            { x: 550, y: 390 },
            { x: 600, y: 300 },
            { x: 690, y: 240 },
            { x: 800, y: 210 },
            { x: 910, y: 230 },
            { x: 1000, y: 300 },
            { x: 1025, y: 390 },
            { x: 1150, y: 350 },
            { x: 1320, y: 270 },
            { x: 1510, y: 195 },
            { x: 1720, y: 145 }
        ],


        saws: [

            {
                x: 310,
                y: 540,
                width: 60,
                height: 60
            },

            {
                x: 570,
                y: 320,
                width: 60,
                height: 60
            },

            {
                x: 850,
                y: 150,
                width: 60,
                height: 60
            },

            {
                x: 960,
                y: 350,
                width: 60,
                height: 60
            },

            {
                x: 1120,
                y: 385,
                width: 60,
                height: 60
            },

            {
                x: 1280,
                y: 245,
                width: 60,
                height: 60
            }

        ],


        base: { x: 29, y: 564, width: 72, height: 72 },
        patient: { x: 1684, y: 109, width: 72, height: 72 }

    }

];
