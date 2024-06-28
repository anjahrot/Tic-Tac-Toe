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
            return false;
        }
        else {    
        gameboard[row][column].addMark(player);
        console.log(`Chosen: ${row} and ${column}`);
        return true;
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


function Game(){
    console.log('Game started');
    const people = Player();

    const players = people.players;
    /* Må lage spillere før man kan kjøre under */
    const input_player1 = prompt('Player 1\'s name: ');
    people.createPlayer(input_player1);
    const input_player2 = prompt('Player 2\'s name: ');
    people.createPlayer(input_player2);

    let active_player = players[0];

    const switchPlayerTurn = () => {
        active_player = (active_player === players[0]) ? players[1] : players[0];
    }
    
    const getActivePlayer = () => active_player;

    const printNewRound = () => {
        gameboard.printBoard();
        console.log(`It is ${getActivePlayer().name} turn`);
    }

    let rounds = 0;
    const roundPlayed = () => rounds++;

    /* Define all possible winning 3-in-a-row */
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

    const checkValue = (curVal) => curVal === getActivePlayer().sign; 

    const checkTie = (curVal) => curVal != 0;

    const playRound = (row, column) => {
        do{
            gameboard.chooseSquare(row, column, getActivePlayer().sign);
        }while(!gameboard.chooseSquare(row, column, getActivePlayer().sign));
        roundPlayed();
        
        /* Check if game is won or tie */
        /* No winning before at least 5 rounds are played */
        if(rounds>4){
            if(chosenRow(row).every(checkValue) || chosenColumn(column).every(checkValue)
               || diagnolTopLeft().every(checkValue) || diagnolBottomLeft().every(checkValue)) {
                console.log(`${getActivePlayer().name} has won the game`) 
                return;
            }
            /* Make gameboard array 1-d before checking all values */
            else if(gameboard.getBoardValues().flat().every(checkTie)) {
                console.log('It\'s a tie!');
            }
        } 
 
        switchPlayerTurn();
        printNewRound();
    }

    printNewRound();

    return {playRound, 
        getActivePlayer,
        createPlayer: people.createPlayer};
};
  
const game = Game();

