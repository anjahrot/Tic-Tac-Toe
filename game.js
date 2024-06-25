 /* Function factory creating players */
 function createPlayer (name) {
    return {name};
}

/* Gameboard - factory function */
function Gameboard () {
    /* Module pattern IIFE */
    const createBoard = (function(){
        const rows = 3;
        const columns = 3;
        const board = [];

        for (let i=0;i<rows;i++) {
            board[i] = [];
            for(let j=0;j<columns;j++) {
                board[i].push(Cell());
            }
        }
    
        const getBoard = () => board;

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

    console.log('game started');
    return {chooseSquare, printBoard};

    };

  
   


