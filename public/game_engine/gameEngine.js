/*

LOGIC

*/

function initBoard(rows, columns, initialValue) {
    var boardArray = [];
    for (let row = 0; row < rows; row++) {
        let boardRow = [];
        for (let column = 0; column < columns; column++) {
            boardRow[column] = initialValue;
        }
        boardArray[row] = boardRow;
    }
    return boardArray;
}

var Logic = function() {
    var win = false;
    var cellsCount = 15;
    var board = initBoard(15, 15, 0);

    var checkWin = function(row, column) {
        let currentPlayerPostion = board[row][column];
        let winExist = false;
        let allDirections = [
            getLineArray(board, currentPlayerPostion, row, column, 1, 0), // vertical line
            getLineArray(board, currentPlayerPostion, row, column, 0, 1), // horizontal line
            getLineArray(board, currentPlayerPostion, row, column, 1, 1), // \ (backward) diagonal line
            getLineArray(board, currentPlayerPostion, row, column, 1, -1) // / (forward) diagonal line
        ];
        console.log(allDirections)

        for (let direction = 0; direction < allDirections.length; direction++) {
            if (allDirections[direction].length >= 5) {
                winExist = true;
                break;
            }
        }

        if (winExist) win = true;
    };

    var getLineArray = function(board, currentPlayerPostion, row, column, dx, dy) {
        var lineArray = [currentPlayerPostion];
        for (let up = 1; up < cellsCount; up++) { // check upward
            let upRow = row - dx * up;
            let upColumn = column - dy * up;
            if (upRow >= cellsCount || upColumn >= cellsCount || upRow < 0 || upColumn < 0) break;
            if (board[upRow][upColumn] === currentPlayerPostion) {
                lineArray.unshift(board[upRow][upColumn]);
            } else break;
        }
        for (let down = 1; down < cellsCount; down++) { // check downward
            let downRow = row + dx * down;
            let downColumn = column + dy * down;
            if (downRow >= cellsCount || downColumn >= cellsCount || downRow < 0 || downColumn < 0) break;
            if (board[downRow][downColumn] === currentPlayerPostion) {
                lineArray.push(board[downRow][downColumn]);
            } else break;
        }
        return lineArray;
    };

    var getLogic = {};
    getLogic.winState = "";
    getLogic.makeMove = function(row, column, player) {
        var that = this;
        board[row][column] = player;
        checkWin(row, column);
        if (win){
            that.winState = `${player == 1 ? 'X' : 'O'} win`;
        }
    };
    return getLogic;
};



/*

MAIN

*/
var ready = (callback) => {
    if (document.readyState != "loading") callback();
    else document.addEventListener("DOMContentLoaded", callback);
}

ready(() => {
    var initLogic = new Logic();
    var logic = initLogic;
    var currentSide = 1; // player - O (-1), computer - X (1)
    var gameOver = false;

    if (currentSide == 1) {
        document.getElementById("message").textContent = "X turn";
    } else {
        document.getElementById("message").textContent = "O turn";
    }

    document.querySelectorAll('div.boardCol').forEach(boardColumn => {
        boardColumn.addEventListener('mousedown', handleMouseDown);
    })
    function handleMouseDown(e){
        if(gameOver) return "";
        var cell = e.currentTarget;
        if (cell.children[0].classList.contains("boardCellCircle")) return "";
        if (cell.children[0].classList.contains("boardCellCross")) return "";
        var indexes = cell.children[0].id.split("-");
        logic.makeMove(parseInt(indexes[0]), parseInt(indexes[1]), currentSide);
        cell.children[0].classList.add(getMoveClass());

        currentSide *= -1; // flip side
        if (currentSide == 1) {
            document.getElementById("message").textContent = "X turn";
        } else {
            document.getElementById("message").textContent = "O turn";
        }

        function getMoveClass(){
            if (currentSide === 1) {
                return "boardCellCross";
            }
            return "boardCellCircle";
        }
        if (logic.winState !== ""){
            let message = document.getElementById("message");
            message.textContent = logic.winState;
            gameOver = true;

            if (logic.winState === "you lost"){
                message.classList.add("looseState");
            }
        }
    }

    document.addEventListener('wheel', handleScale)
    function handleScale(e){
        var value = 100;
        var maxWidth = 700;
        var minValue = 300;
        var board = document.querySelector(".board");
        if ((e.deltaY < 0) && board.offsetWidth < maxWidth){ // scroll mouse up
            board.style.width = (board.offsetWidth + value) + 'px';
            board.style.height = (board.offsetHeight + value) + 'px';
        }
        if ((e.deltaY > 0) && board.offsetWidth > minValue){ // scroll mouse down
            board.style.width = (board.offsetWidth - value) + 'px';
            board.style.height = (board.offsetHeight - value) + 'px';
        }
    }

    document.getElementById("new-O").addEventListener("click", handleNewGame);
    document.getElementById("new-X").addEventListener("click", handleNewGame);
    function handleNewGame(e){
        e.stopPropagation()
        var index =  e.target.id.split("-")[1];

        document.querySelectorAll('.boardCell').forEach(cell => {
            cell.classList.remove('boardCellCross', 'boardCellCircle')
        })
        gameOver = false;
        document.getElementById("message").classList.remove("looseState");
        document.getElementById("message").textContent = "";
        if (index === "O"){
            logic = new Logic();
            currentSide = -1;
            document.getElementById("message").textContent = "O turn";
        }
        if (index === "X"){
            logic = new Logic();
            currentSide = 1;
            document.getElementById("message").textContent = "X turn";
        }
        document.getElementById("check").checked = false;
    }
});