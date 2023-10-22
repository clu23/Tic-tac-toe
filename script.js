

/**
 * This module stores the game board information
 */

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


const Gameboard=(()=>{
    let _board=new Array(9);
    const getField = (num) => _board[num];

    const setField = (num, player) => {
        const htmlField = document.querySelector(`#container-grid button:nth-child(${num + 1}) p`);
        htmlField.classList.add('puff-in-center');
        htmlField.textContent = player.getSign();
        _board[num] = player.getSign();
    }

    const clear = () => {
        for (let i = 0; i < _board.length; i++) {
            _board[i] = undefined;
        }
    }

    const setFieldForAiLogic = (num, player) => {
        if (player == undefined) {
            _board[num] = undefined;
            return;
        }
        _board[num] = player.getSign();
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
        setFieldForAiLogic,
        clear
    };
})();

/**
 * This factoring function is used to create the Player objects 
 */


const Player=(sign) =>{
    let _sign=sign;
    const getSign = () => _sign;
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
    return{
        setSign,
        getSign
    };
}


const minimaxAiLogic = ((percentage) => {

    let aiPrecision = percentage;

    const setAiPercentage = (percentage) => {
        aiPrecision = percentage;
    }
    const getAiPercentage = () => {
        return aiPrecision;
    }

    /**
     * Chooses the next filed for the AI Player.
     * The AI player has an 'aiPercentage' value, this function chooses the best move proportionate to that value,
     * and chooses a random move the rest of the time.
     * For example if the 'aiPercentage' is 64 then the probability of the best move is 0.64 and the probability of a random move is 0.34
     */
    const chooseField = () => {

        //random number between 0 and 100
        const value = Math.floor(Math.random() * (100 + 1));

        // if the random number is smaller then the ais threshold, it findds the best move
        let choice = null;
        if (value <= aiPrecision) {
            console.log('bestChoice');
            choice = minimax(Gameboard, gameController.getSecondPlayer()).index
            const field = Gameboard.getField(choice);
            if (field != undefined) {
                return "error"
            }
        }
        else {
            console.log('NotbestChoice');
            const emptyFieldsIdx = Gameboard.getEmptyFieldsIdx();
            let noBestMove = Math.floor(Math.random() * emptyFieldsIdx.length);
            choice = emptyFieldsIdx[noBestMove];
        }
        return choice;
    }


    const findBestMove = (moves, player) => {
        let bestMove;
        if (player === gameController.getSecondPlayer()) {
            let bestScore = -10000;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            let bestScore = 10000;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }
        return moves[bestMove];

    }

    /**
     * Returns an object which includes the 'index' and the 'score' of the next best move
     * @param {Gameboard} newBoard - call it with the gameBoard
     * @param {player} player - call it with the AI player
     */
    const minimax = (newBoard, player) => {

        let empty = newBoard.getEmptyFieldsIdx();

        if (gameController.checkForDraw(newBoard)) {
            return {
                score: 0
            };
        }
        else if (gameController.checkForWin(newBoard)) {

            if (player.getSign() == gameController.getHumanPlayer().getSign()) {
                return {
                    score: 10
                };
            }
            else if (player.getSign() == gameController.getSecondPlayer().getSign()) {
                return {
                    score: -10
                };
            }
        }

        let moves = [];

        for (let i = 0; i < empty.length; i++) {
            let move = {};
            move.index = empty[i];

            //Change the field value to the sign of the player
            newBoard.setFieldForAiLogic(empty[i], player);

            //Call the minimax with the opposite player
            if (player.getSign() == gameController.getSecondPlayer().getSign()) {
                let result = minimax(newBoard, gameController.getHumanPlayer());
                move.score = result.score;
            }
            else {
                let result = minimax(newBoard, gameController.getSecondPlayer());
                move.score = result.score;
            }

            //Reset the filed value set before
            newBoard.setFieldForAiLogic(empty[i], undefined);

            moves.push(move);
        }

        //find the best move
        return findBestMove(moves, player);

    }
    return {
        minimax,
        chooseField,
        getAiPercentage,
        setAiPercentage
    }
})(100);

/**
 * This module is used to control the game
 */

const gameController = (() => {
    let _gameMode='PlayerVsPlayer'
    const _humanPlayer = Player('X');
    const _secondPlayer = Player('O');
    let _activePlayer=_humanPlayer;
    const _aiLogic=minimaxAiLogic;

    const getHumanPlayer = () => _humanPlayer;
    const getSecondPlayer = () => _secondPlayer;
    const getActivePlayer= () => _activePlayer;

    const _changeActivePlayer = () => {
        if (_activePlayer==_humanPlayer){
            _activePlayer=_secondPlayer;
        }
        else{
            _activePlayer=_humanPlayer
        }
    }

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
    }


    const checkForWin=(board)=>{
        if (_checkForRows(board) || _checkForColumns(board) || _checkForDiagonals(board)) {
            return true;
        }
        return false;

    }

    const checkForDraw=(board)=>{
        if (checkForWin(board)){
            return false;
        }
        for (let i=0; i<9; i++){
            const field=board.getField(i);
            if (field==undefined){
                return false;
            }
        }
        return true;
    }

    const changeSign=(sign)=>{
        const buttons=document.querySelector('.item-player');
        if (sign=='X'){
            _humanPlayer.setSign('X', true);
            _secondPlayer.setSign('O');
            buttons.classList.add('hide');
        }
        else if (sign=='O'){
            _humanPlayer.setSign('O', true);
            _secondPlayer.setSign('X');
            buttons.classList.add('hide');
        }
        else throw 'Incorrect sign entered';
    }

    const changeGameMode=(mode)=>{
        const gameModeSection=document.querySelectorAll('.game-mode, .mode-buttons, .pvsp, .pvsai');
        const paragraph=document.querySelector('p.game-mode');
        console.log(gameModeSection)
        if (mode=='PlayerVsPlayer'){
            _gameMode=mode;
            gameModeSection.forEach(element=>{
                element.classList.add('hide');
            });
            paragraph.textContent='';
        }
        else if (mode=='PlayerVsAi'){
            _gameMode=mode;
            gameModeSection.forEach(element=>{
                element.classList.add('hide');
            })
            paragraph.textContent='';
        }
        else throw 'Incorrect mode entered';
    }

    /**
     * Steps the player to the field, and checks if the game has come to an end.
     * If the game is finished it disables the buttons.
     * @param {int} num - the index of the field which the player clicked
     */

    const playerStep=(num)=>{
        const field=Gameboard.getField(num);
        if (field==undefined){
            Gameboard.setField(num,_activePlayer);
            if (checkForWin(Gameboard)){
                (async() =>{
                    await _sleep(500 + (Math.random() * 500));
                    endGame(_activePlayer.getSign());
                })();
            }
            else if (checkForDraw(Gameboard)) {
                (async () => {
                    await _sleep(500 + (Math.random() * 500));
                    endGame("Draw");
                })();  
            }
            else if (_gameMode=='PlayerVsPlayer'){
                _changeActivePlayer();
            }
            else{
                displayController.deactivate();
                (async () => {
                    await _sleep(250 + (Math.random() * 300));
                    aiStep();
                })();
                displayController.activate();
            }
        }
    }

    const endGame =(sign)=>{

        const card = document.querySelectorAll('#container, .header');

        card.forEach(item => {
            item.classList.remove('unblur');
            item.classList.add('blur');
          });

        const winElements = document.querySelectorAll('.win p');

        if (sign=='Draw'){
            winElements[3].classList.remove('hide');
            console.log('It is a draw');
        }

        else{
            console.log(`The winner is player ${sign}`);
            winElements[0].classList.remove('hide');
            if (sign.toLowerCase()=='x'){
                winElements[1].classList.remove('hide');
            }
            else{
                winElements[2].classList.remove('hide');
            }
        }
        console.log('deactivate');
        displayController.deactivate();
        displayController.makeBodyRestart();
    }

    const aiStep=() =>{
        const num = _aiLogic.chooseField();
        Gameboard.setField(num, _secondPlayer);
        if (checkForWin(Gameboard)) {
            (async () => {
                await _sleep(500 + (Math.random() * 500));
                endGame(_secondPlayer.getSign())
            })();   
        }
        else if (checkForDraw(Gameboard)) {
            (async () => {
                await _sleep(500 + (Math.random() * 500));
                endGame("Draw");
            })();  
        }
    }

    const restart = async function () {

        const card = document.querySelectorAll('#container, .header');
        const winElements = document.querySelectorAll('.win p');
        const buttons=document.querySelectorAll('.item-player, .game-sign, .sign-buttons, .x, .o');
        const gameModeSection=document.querySelectorAll('.game-mode, .mode-buttons, .pvsp, .pvsai');
        const paragraph=document.querySelector('p.game-mode');

        card.forEach(item =>{
            item.classList.add('unblur');
        });
        
        Gameboard.clear();
        displayController.clear();
        console.log('restart');
        displayController.activate();

        card.forEach(item =>{
            item.classList.remove('blur');
        });
      
        winElements.forEach(element => {
            element.classList.add('hide');
        });

        buttons.forEach(button=>{
            button.classList.add('hide');
        })

        gameModeSection.forEach(element=>{
            element.classList.remove('hide')
        })
        paragraph.textContent='Choose a Game mode';
        document.body.removeEventListener('click', gameController.restart);

    }

    
    return {
        getHumanPlayer,
        getSecondPlayer,
        getActivePlayer,
        checkForWin,
        checkForDraw,
        changeSign,
        changeGameMode,
        playerStep,
        endGame,
        aiStep,
        restart
    }

})();

const displayController = (() => {
    const htmlBoard = Array.from(document.querySelectorAll('button.field'));
    const restart = document.querySelector('.restart');
    const pVsP=document.querySelector('.pvsp');
    const pVsAi=document.querySelector('.pvsai');
    const x = document.querySelector('.x');
    const o = document.querySelector('.o');

    const _changePlayerSign = (sign) => {
        gameController.changeSign(sign);
        const signMode=document.querySelectorAll('.item-player, .game-sign, .sign-buttons, .x, .o');
        signMode.forEach(element =>{
            element.classList.add('hide');
        });
        displayController.activate();
    }

    const _changeGameMode=(mode)=>{
        gameController.changeGameMode(mode);
        const gameMode= document.querySelectorAll('.game-mode, .mode-buttons, .pvsp, .pvsai');
        const paragraph=document.querySelector('p.game-mode');
        paragraph.textContent='';
        gameMode.forEach(element =>{
            element.classList.add('hide');
        });
        const signMode=document.querySelectorAll('.item-player, .game-sign, .sign-buttons, .x, .o');
        signMode.forEach(element =>{
            element.classList.remove('hide');
        });
    }

    const clear = () => {
        htmlBoard.forEach(field => {
            const p = field.childNodes[0];
            p.classList = [];
            p.textContent = '';
        });
    }

    const deactivate = () => {
        htmlBoard.forEach(field => {
            field.setAttribute('disabled', '');
        });
    }

    const activate = () => {
        htmlBoard.forEach(field => {
            field.removeAttribute('disabled');
        });
    }
    
    const makeBodyRestart = () =>{
        const body = document.querySelector('body');
        body.addEventListener('click', gameController.restart);
        
    }
    
    const _init = (() => {
        for (let i = 0; i < htmlBoard.length; i++) {
            field = htmlBoard[i];
            field.addEventListener('click', gameController.playerStep.bind(field, i));
        }

        restart.addEventListener('click', gameController.restart);

        pVsP.addEventListener('click', _changeGameMode.bind(this,'PlayerVsPlayer'));

        pVsAi.addEventListener('click', _changeGameMode.bind(this,'PlayerVsAi'));

        x.addEventListener('click', _changePlayerSign.bind(this, 'X'));

        o.addEventListener('click', _changePlayerSign.bind(this, 'O'));

        
        
    })();

    return {
        deactivate,
        activate,
        clear,
        makeBodyRestart
    }

})();

displayController.deactivate();
