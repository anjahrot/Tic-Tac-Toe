 /* Function factory creating players */
 function Player(){
    const players = [];
    
    function createPlayer(name) {
        const player = {};
        player.name = name;
        player.token = (players.length == 0) ? 'x' : 'o';
        players.push(player);      
    }
    
    return {createPlayer, players};
 }

/* Gameboard - factory function */
function Gameboard () {
    /* Module pattern IIFE */
    const createBoard = (function(){
        const rows = 3;
        const columns = 3;
        const gameboard = [];

        for (let i=0;i<rows;i++) {
            gameboard[i] = [];
            for(let j=0;j<columns;j++) {
                gameboard[i].push(Cell());
            }
        }
    
        const getBoard = () => gameboard;

        return {getBoard};
    })();
    
    const gameboard = createBoard.getBoard();

    function Cell() {
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

    return {chooseSquare, printBoard};

    };

function Game(){
    console.log('game started');
    const people = Player();
    /* Må lage spillere før man kan kjøre under... */
    people.createPlayer('Anja');
    people.createPlayer('Other'); 

    const players = people.players;

    let active_player = players[0];

    const gameboard = Gameboard();

    const switchPlayer = () => {
        active_player = (active_player === players[0]) ? players[1] : players[0];
    }
    const getActivePlayer = () => active_player;

    const printNewRound = () => {
        gameboard.printBoard();
        console.log(`It is ${getActivePlayer().name} turn`);
    }

    const playRound = (row, column) => {
        gameboard.chooseSquare(row, column, getActivePlayer().token);
        
        /* Check if game is won or tie */
        switchPlayer();
        printNewRound();
    }
    if(people.players.length === 2){
        printNewRound();
    }else {
        console.log('Add 2 players');
    }

    return {playRound, getActivePlayer};
};
  
const game = Game();


