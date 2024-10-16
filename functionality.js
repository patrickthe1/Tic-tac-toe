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
    };
})();

const DisplayController = (() => {
    const gameBoardElem = document.querySelector("#gameboard");
    const startBtn = document.getElementById("startBtn");
    const resetBtn = document .getElementById("resetBtn");
    const status = document.getElementById("status");
    const player1Input = document.getElementById('player1');
    const player2Input = document.getElementById('player2');   
})