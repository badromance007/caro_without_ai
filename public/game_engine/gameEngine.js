/*

COMBINATIONS

*/
var Combinations = function() {
    var win = [
        [1, 1, 1, 1, 1], // X win
        [-1, -1, -1, -1, -1] // O win
    ];

    var findArray = function(arr, inArr){
        var fCount = arr.length;
        var sCount = inArr.length;
        var k;
        for (var i = 0; i <= fCount - sCount; i++)
        {
            k = 0;
            for (var j = 0; j < sCount; j++)
            {
                if (arr[i + j] == inArr[j]) k++;
                else break;
            }
            if (k == sCount) return true;
        }
        return false;
    };

    var isAnyInArrays = function(combos, arr){
        for (var i = 0; i < combos.length; i++) {
            if (findArray(arr, combos[i])) return true;
        }
        return false;
    };

    var combinations = {};
    combinations.valuePosition = function(arr1,  arr2,  arr3,  arr4){ // 4 directions
        var w = 0;
        var allArr = [arr1,  arr2,  arr3,  arr4];
        for (var i = 0; i < allArr.length; i++) {
            if (isAnyInArrays(win, allArr[i])) {
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
                    getCombo(board, board[row][column], row, column, 1, 0),
                    getCombo(board, board[row][column], row, column, 0, 1),
                    getCombo(board, board[row][column], row, column, 1, 1),
                    getCombo(board, board[row][column], row, column, 1, -1)
                );
                if (playerValue === 1) {
                    win = true;
                }
            }
        }
    };

    var getCombo = function(board, curPlayer, row, column, dx, dy) {
        var combo = [curPlayer];
        for (var m = 1; m < gameSize; m++) {
            var nextX1 = row - dx * m;
            var nextY1 = column - dy * m;
            if (nextX1 >= cellsCount || nextY1 >= cellsCount || nextX1 < 0 || nextY1 < 0) break;
            var next1 = board[nextX1][nextY1];
            if (board[nextX1][nextY1] == -curPlayer) {
                combo.unshift(next1);
                break;
            }
            combo.unshift(next1);
        }
        for (var k = 1; k < gameSize; k++) {
            var nextX = row + dx * k;
            var nextY = column + dy * k;
            if (nextX >= cellsCount || nextY >= cellsCount || nextX < 0 || nextY < 0) break;
            var next = board[nextX][nextY];
            if (next == -curPlayer) {
                combo.push(next);
                break;
            }
            combo.push(next);
        }
        return combo;
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