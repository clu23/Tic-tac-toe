const grid = document.getElementById('container-grid');



const Gameboard=(()=>{
    grid.style.gridTemplateColumns = `repeat(${3}, 1fr)`
    grid.style.gridTemplateRows = `repeat(${3}, 1fr)`
  
    for (let i = 0; i < 9; i++) {
        const gridElement = document.createElement('div')
        gridElement.classList.add('grid-element')
        grid.appendChild(gridElement)
    }
    let cells = document.querySelectorAll('.grid-element');
    return{cells};
})();


const Player=(name,score) =>{
    const displayScore=() => console.log(`The score of ${name} is ${score}`);
}



console.log(Gameboard.cells)