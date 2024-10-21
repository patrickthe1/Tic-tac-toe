const Gameboard = (() =>{
    let board = ["","","","","","","","",""];

    const getBoard = () => board;

    const setMark = (index,mark) => {
        if(board[index] === ""){
            board[index] = mark;
            return true;
        } 
        return false;
    }

    const resetBoard = () => {
        board = ["","","","","","","","",""];
    };

    return {
        getBoard,
        setMark,
        resetBoard,
    }
})();

const Player = (name,mark) => {
    return {name, mark};
};

const Game = (() => {
    let players = [];
    let currentPlayerIndex = 0;
    let isGameOver = false;

    // Function to initialize players
    const initializePlayers = (player1Name, player2Name) => {
        players = [
            Player(player1Name, 'X'),
            Player(player2Name, 'O')
        ];
        currentPlayerIndex = 0;
        isGameOver = false;
        Gameboard.resetBoard();
    };

    // Function to get the current player
    const getCurrentPlayer = () => players[currentPlayerIndex];

    // Function to switch players
    const switchPlayer = () => {
        currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
    };

    // Function to play a round
    const playRound = (index) => {
        if (isGameOver) {
            return;
        }

        const currentPlayer = getCurrentPlayer();
        const successfulMove = Gameboard.setMark(index, currentPlayer.mark);

        if (successfulMove) {
            if (checkWin(currentPlayer.mark)) {
                isGameOver = true;
            } else if (checkTie()) {
                isGameOver = true;
            } else {
                switchPlayer();
            }
        }
    };

    // Function to check for a win
    const checkWin = (mark) => {
        const board = Gameboard.getBoard();
        const winConditions = [
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [0,3,6],
            [1,4,7],
            [2,5,8],
            [0,4,8],
            [2,4,6],
        ];

        return winConditions.some(condition => 
            condition.every(index => board[index] === mark)
        );
    };

    // Function to check for a tie
    const checkTie = () => {
        return Gameboard.getBoard().every(cell => cell !== "");
    };

    // Function to reset the game
    const resetGame = () => {
        Gameboard.resetBoard();
        isGameOver = false;
        currentPlayerIndex = 0;
    };

    // Expose public methods
    return {
        initializePlayers,
        playRound,
        getCurrentPlayer,
        checkWin,
        checkTie,
        resetGame,
        get isGameOver() {
            return isGameOver;
        }
    };
})();


const DisplayController = (() => {
    const gameBoardElem = document.querySelector("#gameboard");
    const startBtn = document.getElementById("startBtn");
    const resetBtn = document .getElementById("resetBtn");
    const status = document.getElementById("status");
    const player1Input = document.getElementById('player1');
    const player2Input = document.getElementById('player2'); 
    //initialize event listeners
    const initialize = () => {
        startBtn.addEventListener("click",startGame);
        resetBtn.addEventListener("click",resetGame);
        gameBoardElem.addEventListener("click",handleCellClick);
    };
    //startGame
    const startGame = () => {
        const player1Name = player1Input.value.trim() || "player1";
        const player2Name = player2Input.value.trim() || "player2";

        Game.initializePlayers(player1Name,player2Name);
        renderBoard();
        updateStatus(`${Game.getCurrentPlayer().name}'s turn (${Game.getCurrentPlayer().mark})`);
        
    }
    //Reset Game
    const resetGame = () => {
        Game.resetGame();
        renderBoard();
        updateStatus('Game has been reset. Start a new game!');
    };

    //Handle cell clicks 
    const handleCellClick = (e) => {
        if(e.target.classList.contains("cell")){
            const index = e.target.getAttribute("data-index");
            Game.playRound(parseInt(index));
            updateDisplay();
        }
    };

    // Render the board to the DOM
    const renderBoard = () => {
        const board = Gameboard.getBoard();

        board.forEach((mark,index) => {
            const cell = document.querySelector(`.cell[data-index="${index}"]`);
            cell.textContent = mark;
            cell.style.pointerEvents = Game.isGameOver ? "none" : "auto";

        });
    };

    // Update the display after a move
    const updateDisplay = () => {
        renderBoard();
        if (Game.isGameOver) {
            if (Game.checkTie()) {
                updateStatus("It's a tie!");
            } else {
                const winner = Game.getCurrentPlayer();
                updateStatus(`${winner.name} wins!`);
            }
            disableBoard();
        } else {
            const currentPlayer = Game.getCurrentPlayer();
            updateStatus(`${currentPlayer.name}'s turn (${currentPlayer.mark})`);
        }
    };


     // Update the status message
     const updateStatus = (message) => {
        status.textContent = message;
    };

     // Disable the game board
     const disableBoard = () => {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.style.pointerEvents = 'none';
        });
    };
    //Enable the game board
    const enableBoard = () => {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.style.pointerEvents = 'auto';
        });
    };

    //Expose public methods

    return {
        initialize,
    };
})();

DisplayController.initialize();
