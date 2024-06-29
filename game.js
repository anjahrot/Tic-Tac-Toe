 /* Function factory creating players */
 function Player(){
    const players = [];
    
    function createPlayer(name) {
        const player = {};
        player.name = name;
        player.sign = (players.length == 0) ? 'x' : 'o';
        players.push(player);      
    }
    
    return {createPlayer, players};
 }

/* Gameboard - factory function inside Module pattern IIFE */
const gameboard = (() => {
    
    const rows = 3;
    const columns = 3;
    const gameboard = [];

    for (let i=0;i<rows;i++) {
        gameboard[i] = [];
        for(let j=0;j<columns;j++) {
            gameboard[i].push(Square());
        }
    }
    
    const getBoard = () => gameboard;  

    const getBoardValues = () => {
        const gameboardValues = gameboard.map((row) => 
            row.map((cell) => cell.getValue()));
        return gameboardValues;
    }
    

    function Square() {
        let value = 0;
        
        const addMark = (player) => {
            value = player;
        }
    
        const getValue = () => value;
    
        return {addMark, getValue};
    };
 
      
    const chooseSquare = (row, column, player) => {
        if(gameboard[row][column].getValue() !== 0) {
            console.log('Try again!')
            return false; 
        }
        else {    
        gameboard[row][column].addMark(player);
        console.log(`Chosen: ${row} and ${column}`);
        } 
    }

    /* Print board in console - not needed after adding UI */
    const printBoard = () => {
        const gameboardWithValues = gameboard.map((row) => 
            row.map((cell) => cell.getValue()))
        console.log(gameboardWithValues);
    };


    return {getBoard, chooseSquare, printBoard, getBoardValues};

})();


function Game(players){

    let active_player = players[0];

    const switchPlayerTurn = () => {
        active_player = (active_player === players[0]) ? players[1] : players[0];
    }
    
    const getActivePlayer = () => active_player;


    /* For console version of game... 
    const printNewRound = () => {
        gameboard.printBoard();
        console.log(`It is ${getActivePlayer().name} turn`);
    } */

    let rounds = 0;
    const roundPlayed = () => rounds++;

    /* Define all possible winning 3-in-a-rows */
    const chosenRow = (row) =>  gameboard.getBoardValues()[row];

    const transpose = (matrix) => matrix.map((col, i) => matrix.map((row) => row[i]));

    const chosenColumn = (column) => transpose(gameboard.getBoardValues())[column];

    const diagnolTopLeft = () => {
        const diagnol = [];
        for(let i=0; i<=2; i++){
            diagnol.push(gameboard.getBoardValues()[i][i]);
        }
        return diagnol;
    }

    const diagnolBottomLeft = () => {
        const diagnol = [];
        for(let i=0; i<=2; i++){
            diagnol.push(gameboard.getBoardValues()[2-i][i]);
        }
        return diagnol;
    }

    const checkAllValues = (curVal) => curVal === getActivePlayer().sign; 

    const checkTie = (curVal) => curVal != 0;

    const playRound = (row, column) => {
        let gameState = '';
        const markAdded = gameboard.chooseSquare(row, column, getActivePlayer().sign);
        /* chooseSquare function returns false if square not available */
        if(markAdded !== false) {
            roundPlayed();
        
            /* Check if game is won or tie */
            /* No winning before at least 5 rounds are played */
            if(rounds>4){
                if(chosenRow(row).every(checkAllValues) || chosenColumn(column).every(checkAllValues)
                    || diagnolTopLeft().every(checkAllValues) || diagnolBottomLeft().every(checkAllValues)) {
                    gameState = `${getActivePlayer().name} has won the game`;
                    return gameState;
                }
            /* Make gameboard array 1-d before checking all values */
                else if(gameboard.getBoardValues().flat().every(checkTie)) {
                    gameState = 'It\'s a tie!';
                    return gameState; 
                }
            } 
 
            switchPlayerTurn();
        }
        /* printNewRound(); */
        return gameState;
    }

    /* printNewRound(); */

    return {playRound, 
        getActivePlayer,
        getBoard: gameboard.getBoard
    };
};

function GameController() {

    const playerTurnDiv = document.querySelector(".turn");
    const boardDiv = document.querySelector(".board");
    const popupDiv = document.querySelector("#popup")
    const formElem = document.querySelector("form");
    const startBtn = document.querySelector("#startBtn");
    
    //Handle input from form to create players and then start game
    startBtn.addEventListener("click", getPlayers_startGame);
    
    const player = Player();
    let players = player.players;

    function getPlayers_startGame (e) {
        e.preventDefault();

        const data = new FormData(formElem);

        //Need Player module to create players
        let player_one = data.get("p1_name");
        let player_two = data.get("p2_name");

        player.createPlayer(player_one);
        player.createPlayer(player_two);
       
        popupDiv.style.display = 'none'; 
        boardDiv.style.display = 'grid';
        //remove input text 
        formElem.reset();  
        displayController(); 
    }
    
    function displayController () {
        let game = Game(players);

        const updateScreen = (roundResult) => {
            boardDiv.textContent = '';

            //Get newest version of the board and player turn
            const gameboard = game.getBoard();
            const activePlayer = game.getActivePlayer();

            //render board
            let row_index = 0;
            gameboard.forEach(row => {
                row.forEach((cell, col_index) => {
                    const cellButton = document.createElement("button");
                    cellButton.classList.add("cell");
                    //need row and column index to pass into playRound
                    cellButton.dataset.row = row_index;
                    cellButton.dataset.column = col_index;
                    cellButton.textContent = cell.getValue();
                    boardDiv.appendChild(cellButton);
                })
                row_index++;
            })
            /* Add logic to end game and write message to screen when game is over, play new game btn */
            if(roundResult !== ''){
                playerTurnDiv.textContent = roundResult;
                //Board not clickable once game is finished
                boardDiv.removeEventListener("click", clickHandlerBoard);
                const newGameBtn = document.createElement("button");
                newGameBtn.textContent = 'New Game';
                newGameBtn.classList.add("new");
                playerTurnDiv.appendChild(newGameBtn);
                //Add eventlistener to new game button
                newGameBtn.addEventListener("click", startNewGame);
            }
            else{
                playerTurnDiv.textContent = `It is ${activePlayer.name}'s turn...`;
            }
        }

        //Add eventlistener for the board
        boardDiv.addEventListener("click", clickHandlerBoard);

        function clickHandlerBoard(e) {
            const selectedRow = e.target.dataset.row;
            const selectedColumn = e.target.dataset.column;
        
            //If hit gap between squares
            if(!selectedColumn) return;

            const roundResult = game.playRound(selectedRow, selectedColumn);
            updateScreen(roundResult);
        }


        function startNewGame() {
            popupDiv.style.display = 'inline';
            boardDiv.style.display = 'none';
            playerTurnDiv.textContent = '';
        }

    //update screen on start
    updateScreen('');
    }
}

GameController();
