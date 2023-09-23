
/*
const grid = document.getElementById('container-grid');
grid.style.gridTemplateColumns = `repeat(${3}, 1fr)`
grid.style.gridTemplateRows = `repeat(${3}, 1fr)`
  
    for (let i = 0; i < 9; i++) {
        const gridElement = document.createElement('div')
        gridElement.classList.add('grid-element')
        grid.appendChild(gridElement)
    }
let cells = document.querySelectorAll('.grid-element');
*/


/**
 * This module stores the game board information
 */

const Gameboard=(()=>{
    let _board=new Array(9);
    const getField = (num) => _board[num];

    const setField = (num, player) => {
        const htmlField = document.querySelector(`.board button:nth-child(${num + 1}) p`);
        htmlField.textContent = player.getSign();
        _board[num] = player.getSign();
    }

    const clear = () => {
        for (let i = 0; i < _board.length; i++) {
            _board[i] = undefined;
        }
    }

    const getEmptyFieldsIdx = () => {
        let fields = [];
        for (let i = 0; i < _board.length; i++) {
            const field = _board[i];
            if (field == undefined) {
                fields.push(i);
            }
        }
        return fields;
    }

    
    return{
        getEmptyFieldsIdx,
        getField,
        setField,
        clear
    };
})();

/**
 * This factoring function is used to create the Player objects 
 */


const Player=(name,sign) =>{
    let _name=name;
    let _sign=sign;
    const getSign=()=>_sign;
    const setSign=(sign,active)=>{
        _sign=sign;
        const p=document.querySelector(`.btn-p.${sign.toLowerCase()}`);
        if (active){
            p.classList.add('selected');
            p.classList.remove('unselected');
        }
        else{
            p.classList.remove('selected');
            p.classList.add('unselected');
        }
    }
    const getName=()=>_name;
    return{
        displayScore,
        setSign,
        getSign,
        getName
    };
}

/**
 * This module is used to control the game
 */

const gameController = (() => {
    const _humanPlayer = Player('X');
    const _aiPlayer = Player('O');

    const getHumanPlayer = () => _humanPlayer;
    const getAiPlayer = () => _aiPlayer;

    const _sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const _checkForRows = (board) => {
        for (let i = 0; i < 3; i++) {
            let row = [];
            for (let j = i * 3; j < (i+1) * 3; j++) {
                row.push(board.getField(j));
            }

            if (row.every(field => field == 'X') || row.every(field => field == 'O')) {
                return true;
            }
        }
        return false;
    }

    const _checkForColumns= (board) =>{
        for (let i=0; i<3; i++) {
            let column=[];
            for (let j=0;j<3;j++){
                column.push(board.getField(j*3+i));
            }

            if (column.every(field => field == 'X') || column.every(field => field == 'O')) {
                return true;
            }
        }
        return false;
    }

    const _checkForDiagonals= (board) =>{
        diagonal1=[board.getField(0), board.getField(4), board.getField(8)];
        diagonal2=[board.getField(2), board.getField(4), board.getField(6)];

        if (diagonal1.every(field => field == 'X') || diagonal1.every(field => field == 'O')) {
            return true;
        }
        else if (diagonal2.every(field => field == 'X') || diagonal2.every(field => field == 'O')){
            return true;
        }

        else{
            return false;
        }
    }


    const checkForWin=(board)=>{
        if (_checkForRows(board) || _checkForColumns(board) || _checkForDiagonals(board)) {
            return true;
        }
        else{
            return false;
        }
    }

})();



