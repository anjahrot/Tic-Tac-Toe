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
            return;
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

    return {getBoard, chooseSquare, printBoard};

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

    const switchPlayer = () => {
        active_player = (active_player === players[0]) ? players[1] : players[0];
    }
    const getActivePlayer = () => active_player;

    const printNewRound = () => {
        gameboard.printBoard();
        console.log(`It is ${getActivePlayer().name} turn`);
    }

    const playRound = (row, column) => {
        gameboard.chooseSquare(row, column, getActivePlayer().sign);
        
        /* Check if game is won or tie */
        switchPlayer();
        printNewRound();
    }

    printNewRound();

    return {playRound, 
        getActivePlayer,
        createPlayer: people.createPlayer};
};
  
const game = Game();


