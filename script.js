
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

    const clear = () => {
        for (let i = 0; i < _board.length; i++) {
            _board[i] = undefined;
        }
    }

    
    return{
        getField,
        clear
    };
})();


const Player=(name,score) =>{
    const displayScore=() => console.log(`The score of ${name} is ${score}`);
}



