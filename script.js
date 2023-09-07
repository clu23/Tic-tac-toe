const grid = document.getElementById('container-grid');
let cells = document.querySelectorAll('.grid-element');

grid.style.gridTemplateColumns = `repeat(${3}, 1fr)`
grid.style.gridTemplateRows = `repeat(${3}, 1fr)`

      
for (let i = 0; i < 9; i++) {
    const gridElement = document.createElement('div')
    gridElement.classList.add('grid-element')
    grid.appendChild(gridElement)
    }

cells = document.querySelectorAll('.grid-element');
