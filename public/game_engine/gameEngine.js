/*

COMBINATIONS

*/
var Combinations = function() {
    const X = 1;
    const O = -1;
    const WIN = [
        X, // X win
        O // O win
    ];

    var isThisDirectionWin = function(winArray, directionArray){
        if (directionArray.length === 5) {
            for (var i = 0; i < winArray.length; i++) {
                let isWin = directionArray.every(function(value) {
                    return value === winArray[i]
                })
                if (isWin) return true;
            }
        }
        return false;
    };

    var combinations = {};
    combinations.valuePosition = function(verticalLineArray, horizontalLineArray, backwardDiagonalLineArray, forwardDiagonalLineArray){ // 4 directions
        var w = 0;
        var allDirections = [verticalLineArray, horizontalLineArray, backwardDiagonalLineArray, forwardDiagonalLineArray];
        for (let direction = 0; direction < allDirections.length; direction++) {
            if (isThisDirectionWin(WIN, allDirections[direction])) {
                w = 1;
                break;
            }
        }
        return w;
    };
    return combinations;
};


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

var initCombinations = new Combinations();

var Logic = function(player) {
    var gameSize = 5; // 5 in line
    var win = false;
    var cellsCount = 15;
    var board = initBoard(15, 15, 0);
    var maxPlayer = player || -1; // X = 1, O = -1
    var combinations = initCombinations;

    var checkWin = function() {
        for (let row = 0; row < cellsCount; row++) {
            for (let column = 0; column < cellsCount; column++) {
                if (board[row][column] == 0) continue;
                let playerValue = combinations.valuePosition(
                    getLineArray(board, board[row][column], row, column, 1, 0), // vertical line
                    getLineArray(board, board[row][column], row, column, 0, 1), // horizontal line
                    getLineArray(board, board[row][column], row, column, 1, 1), // \ (backward) diagonal line
                    getLineArray(board, board[row][column], row, column, 1, -1) // / (forward) diagonal line
                );
                if (playerValue === 1) {
                    win = true;
                }
            }
        }
    };

    var getLineArray = function(board, currentPostion, row, column, dx, dy) {
        var lineArray = [currentPostion];
        for (let up = 1; up< gameSize; up++) { // check upward
            let upRow = row - dx * up;
            let upColumn = column - dy * up;
            if (upRow >= cellsCount || upColumn >= cellsCount || upRow < 0 || upColumn < 0) break;
            if (board[upRow][upColumn] == currentPostion) {
                lineArray.unshift(board[upRow][upColumn]);
            }
            if (board[upRow][upColumn] == -currentPostion) break;
        }
        for (let down = 1; down < gameSize; down++) { // check downward
            let downRow = row + dx * down;
            let downColumn = column + dy * down;
            if (downRow >= cellsCount || downColumn >= cellsCount || downRow < 0 || downColumn < 0) break;
            if (board[downRow][downColumn] == currentPostion) {
                lineArray.push(board[downRow][downColumn]);
            }
            if (board[downRow][downColumn] == -currentPostion) break;
        }
        return lineArray;
    };

    var getLogic = {};
    getLogic.winState = "";
    getLogic.makeMove = function(row, column, player) {
        var that = this;
        maxPlayer = player
        board[row][column] = maxPlayer;
        checkWin();
        if (win){
            that.winState = `${maxPlayer == 1 ? 'X' : 'O'} win`;
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
        logic.makeMove(indexes[0],indexes[1], currentSide);
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
            logic = new Logic(1);
            currentSide = 1;
            document.getElementById("message").textContent = "X turn";
        }
        document.getElementById("check").checked = false;
    }
});