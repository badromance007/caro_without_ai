/*

COMBINATIONS

*/
var Combinations = function() {
    var win = [[1, 1, 1, 1, 1]];
    (function() { //add same combinations for another player
        var allCombos = [win];
        for (var k = 0; k < allCombos.length; k++) {
            var temp = [];
            for (var j = 0; j < allCombos[k].length; j++) {
                var tmp = [];
                for (var i = 0; i < allCombos[k][j].length; i++)
                    tmp[i] = -allCombos[k][j][i];
                temp.push(tmp);
            }
            for (var m = 0; m < temp.length; m++) {
                allCombos[k].push(temp[m]);
            }
        }
    }());

    var valueCombo = function(w) {
        if (w > 0)            return 1000000000;
        return 0;
    };

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
    combinations.winValue = 1000000000;
    combinations.valuePosition = function(arr1,  arr2,  arr3,  arr4){ // 4 directions
        var w = 0, u2 = 0, u3 = 0, u4 = 0, c3 = 0, c4 = 0;
        var allArr = [arr1,  arr2,  arr3,  arr4];
        for (var i = 0; i < allArr.length; i++) {
            if (isAnyInArrays(win, allArr[i])) {
                w++;
                continue;
            }
        }
        return valueCombo(w);
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
        for (var i = 0; i < cellsCount; i++) {
            for (var j = 0; j < cellsCount; j++) {
                if (board[i][j] == 0) continue;
                var playerVal = combinations.valuePosition(
                    getCombo(board, board[i][j], i, j, 1, 0),
                    getCombo(board, board[i][j], i, j, 0, 1),
                    getCombo(board, board[i][j], i, j, 1, 1),
                    getCombo(board, board[i][j], i, j, 1, -1)
                );
                if (playerVal === combinations.winValue) {
                    win = true;
                }
            }
        }
    };

    var getCombo = function(node, curPlayer, i, j, dx, dy) {
        var combo = [curPlayer];
        for (var m = 1; m < gameSize; m++) {
            var nextX1 = i - dx * m;
            var nextY1 = j - dy * m;
            if (nextX1 >= cellsCount || nextY1 >= cellsCount || nextX1 < 0 || nextY1 < 0) break;
            var next1 = node[nextX1][nextY1];
            if (node[nextX1][nextY1] == -curPlayer) {
                combo.unshift(next1);
                break;
            }
            combo.unshift(next1);
        }
        for (var k = 1; k < gameSize; k++) {
            var nextX = i + dx * k;
            var nextY = j + dy * k;
            if (nextX >= cellsCount || nextY >= cellsCount || nextX < 0 || nextY < 0) break;
            var next = node[nextX][nextY];
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
    getLogic.makeMove = function(x, y, player) {
        var that = this;
        maxPlayer = player
        board[x][y] = maxPlayer;
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