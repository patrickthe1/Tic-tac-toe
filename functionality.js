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
    let isGameover = false;

    const initializePlayers = (player1,player2) => {
        players = [Player(player1, "X"),Player(player2,"O")];

            currentPlayerIndex = 0;
            isGameover =false;
            Gameboard.resetBoard();
    };

    const getCurrentPlayer = () => players[currentPlayerIndex];

    const switchPlayer = () => {
        currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;

    }

    const playRound = (index) => {
        if(isGameover) {
            console.log("Game is over, please restart to play again!");
            return;
        }

        const currentPlayer = getCurrentPlayer();

        const successfulMove = Gameboard.setMark(index,currentPlayer.mark);

        if(successfulMove){
            console.log(`${currentPlayer.name} placed ${currentPlayer.mark} at position ${index}`);
            displayBoard();
             if(checkWin(currentPlayer.mark)){
                console.log(`${currentPlayer.name} wins!`);
                isGameover = true;
             } else if (checkTie()){
                console.log("It's a tie!");
                isGameover = true;
             } else {
                switchPlayer();
             } 
        }
        else {
            console.log("Invalid Move! Spot already taken");
        }
    }

    const displayBoard = () => {
        const board = Gameboard.getBoard();

        console.log(`
${board[0]} | ${board[1]} | ${board[2]}
${board[3]} | ${board[4]} | ${board[5]}
${board[6]} | ${board[7]} | ${board[8]}
        `)
    };


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

    const checkTie = () =>{
        return Gameboard.getBoard().every(cell => cell !== "")
    }

    const resetGame = () => {
        Gameboard.resetBoard();
        isGameover = false;
        currentPlayerIndex = 0;
        console.log("Game has been reset");
        displayBoard();
    }

    return {
        initializePlayers,
        playRound,
        displayBoard,
        resetGame,
        getCurrentPlayer,    // expose this
        checkTie,            // expose this
        isGameover,
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
            cell.style.pointerEvents = Game.isGameover ? "none" : "auto";

        });
    };

    // Update the display after a move
    const updateDisplay = () => {
        renderBoard();
        if (Game.isGameover) {
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
