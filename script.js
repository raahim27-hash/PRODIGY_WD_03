let music = new Audio("music.mp3");
let audioTurn = new Audio("ting.mp3");
let gameover = new Audio("game_over.mp3");
let turn = "X";
let isGameOver = false;
let gameMode = "pvp"; 

music.loop = true;

const changeTurn = () => {
    return turn === "X" ? "O" : "X";
};

const checkWin = () => {
    let tiles = document.getElementsByClassName('tiles');
    let wins = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    wins.forEach(e => {
        if ((tiles[e[0]].innerText === tiles[e[1]].innerText) && 
            (tiles[e[2]].innerText === tiles[e[1]].innerText) && 
            (tiles[e[0]].innerText !== "")) {
            document.querySelector('.info').innerText = tiles[e[0]].innerText + " Won";
            isGameOver = true;
            gameover.play();
            music.pause();
            document.querySelector("#win-image img").style.display = "block";
        }
    });

    if (!isGameOver) {
        let isDraw = true;
        Array.from(tiles).forEach(tile => {
            if (tile.innerText === '') {
                isDraw = false;
            }
        });

        if (isDraw) {
            document.querySelector('.info').innerText = "Match Tied";
            isGameOver = true;
            gameover.play();
            music.pause();
            document.querySelector("#win-image img").style.display = "block";
            setTimeout(() => {
                resetGame(true); 
            }, 2000);
        }
    }
};

let tiles = document.getElementsByClassName("tiles");
Array.from(tiles).forEach(element => {
    element.addEventListener('click', () => {
        if (element.innerText === '' && !isGameOver) {
            element.innerText = turn;
            audioTurn.play();
            checkWin();
            if (!isGameOver) {
                if (gameMode === "pvp") {
                    turn = changeTurn();
                    document.querySelector(".info").innerText = "Turn for " + turn;
                } else if (gameMode === "ai" && turn === "X") {
                    turn = changeTurn();
                    document.querySelector(".info").innerText = "Turn for " + turn;
                    setTimeout(aiMove, 500);  
                }
            }
        }
    });
});

const aiMove = () => {
    let tiles = document.getElementsByClassName('tiles');
    let emptyTiles = [];
    Array.from(tiles).forEach((tile, index) => {
        if (tile.innerText === '') {
            emptyTiles.push(index);
        }
    });
    if (emptyTiles.length > 0) {
        let randomIndex = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        tiles[randomIndex].innerText = turn;
        audioTurn.play();
        checkWin();
        if (!isGameOver) {
            turn = changeTurn();
            document.querySelector(".info").innerText = "Turn for " + turn;
        }
    }
};

const resetGame = (restartSameMode = false) => {
    let tiles = document.getElementsByClassName('tiles');
    Array.from(tiles).forEach(tile => {
        tile.innerText = '';
    });
    turn = "X";
    isGameOver = false;
    document.querySelector(".info").innerText = "Turn for " + turn;
    document.querySelector("#win-image img").style.display = "none";

    const startScreen = document.getElementById('start-screen');
    const gameContainer = document.getElementById('game-container');
    const modeSelection = document.getElementById('mode-selection');

    gameContainer.style.display = 'none';
    modeSelection.style.display = 'none';

    startScreen.style.display = 'block';
    setTimeout(() => {
        startScreen.style.display = 'none';
        if (!restartSameMode) {
            modeSelection.style.display = 'block';
        } else {
            gameContainer.style.display = 'block';
        }
        music.play(); 
    }, 3000);
};

window.onload = () => {
    const startScreen = document.getElementById('start-screen');
    const gameContainer = document.getElementById('game-container');
    const modeSelection = document.getElementById('mode-selection');
    startScreen.style.display = 'block';
    gameContainer.style.display = 'none';
    modeSelection.style.display = 'none';
    music.play(); 
    setTimeout(() => {
        startScreen.style.display = 'none';
        modeSelection.style.display = 'block';
    }, 3000);
};

const startGame = (mode) => {
    gameMode = mode;
    const modeSelection = document.getElementById('mode-selection');
    const gameContainer = document.getElementById('game-container');
    modeSelection.style.display = 'none';
    gameContainer.style.display = 'block';
    document.querySelector(".info").innerText = "Turn for " + turn;
    music.play(); 
};

document.body.addEventListener('click', () => {
    if (music.paused) {
        music.play().catch((error) => {
            console.error("Failed to play music due to browser restrictions:", error);
        });
    }
}, { once: true });
