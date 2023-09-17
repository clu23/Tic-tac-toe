
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

    
    return{
        getField,
        setField,
        clear
    };
})();

/**
 * This factoring function is used to create the Player objects 
 */


const Player=(name,sign) =>{
    let name=_name;
    let _sign=sign;
    const displayScore=() => console.log(`The score of ${name} is ${score}`);
    const getSign=()=>_sign;
    return{
        displayScore,
        getSign
    };
}



