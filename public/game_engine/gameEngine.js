/*

COMBINATIONS

*/
var Combinations = function() {
    var win = [[1, 1, 1, 1, 1]];
    var unCovered4 = [[0, 1, 1, 1, 1, 0]];
    var unCovered3 = [
        [0, 1, 1, 1, 0, 0], [0, 0, 1, 1, 1, 0],
        [0, 1, 0, 1, 1, 0], [0, 1, 1, 0, 1, 0]
    ];
    var unCovered2 = [
        [0, 0, 1, 1, 0, 0], [0, 1, 0, 1, 0, 0],
        [0, 0, 1, 0, 1, 0], [0, 1, 1, 0, 0, 0],
        [0, 0, 0, 1, 1, 0], [0, 1, 0, 0, 1, 0]
    ];
    var covered4 = [
        [-1, 1, 0, 1, 1, 1], [-1, 1, 1, 0, 1, 1],
        [-1, 1, 1, 1, 0, 1], [-1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, -1], [1, 0, 1, 1, 1, -1],
        [1, 1, 0, 1, 1, -1], [1, 1, 1, 0, 1, -1]
    ];
    var covered3 = [
        [-1, 1, 1, 1, 0, 0], [-1, 1, 1, 0, 1, 0],
        [-1, 1, 0, 1, 1, 0], [0, 0, 1, 1, 1, -1],
        [0, 1, 0, 1, 1, -1], [0, 1, 1, 0, 1, -1],
        [-1, 1, 0, 1, 0, 1, -1], [-1, 0, 1, 1, 1, 0, -1],
        [-1, 1, 1, 0, 0, 1, -1], [-1, 1, 0, 0, 1, 1, -1]
    ];

    (function() { //add same combinations for another player
        var allCombos = [win, unCovered4, unCovered3, unCovered2, covered4, covered3];
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

    var valueCombo = function(w, u2, u3, u4, c3, c4) {
        if (w > 0)            return 1000000000;
        if (u4 > 0)           return 100000000;
        if (c4 > 1)           return 10000000;
        if (u3 > 0 && c4 > 0) return 1000000;
        if (u3 > 1)           return 100000;

        if (u3 == 1) {
            if (u2 == 3)        return 40000;
            if (u2 == 2)        return 38000;
            if (u2 == 1)        return 35000;
            return 3450;
        }

        if (c4 == 1) {
            if (u2 == 3)        return 4500;
            if (u2 == 2)        return 4200;
            if (u2 == 1)        return 4100;
            return 4050;
        }

        if (c3 == 1) {
            if (u2 == 3)        return 3400;
            if (u2 == 2)        return 3300;
            if (u2 == 1)        return 3100;
        }

        if (c3 == 2) {
            if (u2 == 2)        return 3000;
            if (u2 == 1)        return 2900;
        }

        if (c3 == 3) {
            if (u2 == 1)        return 2800;
        }

        if (u2 == 4)          return 2700;
        if (u2 == 3)          return 2500;
        if (u2 == 2)          return 2000;
        if (u2 == 1)          return 1000;
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
            if (isAnyInArrays(covered4, allArr[i])) {
                c4++;
                continue;
            }
            if (isAnyInArrays(covered3, allArr[i])) {
                c3++;
                continue;
            }
            if (isAnyInArrays(unCovered4, allArr[i])) {
                u4++;
                continue;
            }
            if (isAnyInArrays(unCovered3, allArr[i])) {
                u3++;
                continue;
            }
            if (isAnyInArrays(unCovered2, allArr[i])) {
                u2++;
            }
        }
        return valueCombo(w, u2, u3, u4, c3, c4);
    };
    return combinations;
};










/*

LOGIC

*/



Array.matrix = function(m,n,initial) {
    var a, i, j, mat = [];
    for (i = 0; i < m; i++) {
        a = [];
        for (j = 0; j < n; j++) {
            a[j] = initial;
        }
        mat[i] = a;
    }
    return mat;
};

var initCombinations = new Combinations();

var Logic = function(player) {
    var gameSize = 5; // 5 in line
    var ring = 1; // ring size around current cells
    var win = false;
    var cellsCount = 15;
    var curState = Array.matrix(15, 15, 0);
    var complexity = 1;
    var maxPlayer = player || -1; // X = 1, O = -1
    var combinations = initCombinations;
    if (maxPlayer === -1) curState[7][7] = 1;

    var checkWin = function() {
        for (var i = 0; i < cellsCount; i++) {
            for (var j = 0; j < cellsCount; j++) {
            if (curState[i][j] == 0) continue;
            var playerVal = combinations.valuePosition(
                getCombo(curState, curState[i][j], i, j, 1, 0),
                getCombo(curState, curState[i][j], i, j, 0, 1),
                getCombo(curState, curState[i][j], i, j, 1, 1),
                getCombo(curState, curState[i][j], i, j, 1, -1)
            );
            if (playerVal === combinations.winValue) {
                win = true;
            }
            }
        }
    };

    var miniMax = function minimax(node, depth, player, parent) {
        if (depth == 0) return heuristic(node, parent);
        var alpha = Number.MIN_VALUE;
        var childs = getChilds(node, player);
        for (var i = 0; i < childs.length; i++) {
            alpha = Math.max(alpha, -minimax(childs[i], depth - 1, -player, node));
        }
        return alpha;
    };

    var isAllSatisfy = function (candidates, pointX, pointY) {
        var counter = 0;
        for (var i = 0; i < candidates.length; i++) {
            if (pointX != candidates[i][0] || pointY != candidates[i][1]) counter++;
        }
        return counter == candidates.length;
    };

    var getChilds = function(parent, player) {
        var children = [];
        var candidates = [];
        for (var i = 0; i < cellsCount; i++) {
            for (var j = 0; j < cellsCount; j++) {
            if (parent[i][j] != 0) {
                for (var k = i - ring; k <= i + ring; k++) {
                for (var l = j - ring; l <= j + ring; l++) {
                    if (k >= 0 && l >= 0 && k < cellsCount && l < cellsCount) {
                        if (parent[k][l] == 0) {
                            var curPoint = [k, l];
                            var flag = isAllSatisfy(candidates, curPoint[0], curPoint[1]);
                            if (flag) candidates.push(curPoint);
                        }
                    }
                }
                }
            }
            }
        }
        for (var f = 0; f < candidates.length; f++) {
            var tmp = Array.matrix(cellsCount, cellsCount, 0);
            for (var m = 0; m < cellsCount; m++) {
                for (var n = 0; n < cellsCount; n++) {
                    tmp[m][n] = parent[m][n];
                }
            }
            tmp[candidates[f][0]][candidates[f][1]] = -player;
            children.push(tmp);
        }
        return children;
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

    var heuristic = function(newNode, oldNode) {
        for (var i = 0; i < cellsCount; i++) {
            for (var j = 0; j < cellsCount; j++) {
                if (newNode[i][j] != oldNode[i][j]) {
                    var curCell = newNode[i][j];
                    var playerVal = combinations.valuePosition(
                        getCombo(newNode, curCell, i, j, 1, 0),
                        getCombo(newNode, curCell, i, j, 0, 1),
                        getCombo(newNode, curCell, i, j, 1, 1),
                        getCombo(newNode, curCell, i, j, 1, -1)
                    );
                    newNode[i][j] = -curCell;
                    var oppositeVal = combinations.valuePosition(
                        getCombo(newNode, -curCell, i, j, 1, 0),
                        getCombo(newNode, -curCell, i, j, 0, 1),
                        getCombo(newNode, -curCell, i, j, 1, 1),
                        getCombo(newNode, -curCell, i, j, 1, -1)
                    );
                    newNode[i][j] = -curCell;
                    return 2 * playerVal + oppositeVal;
                }
            }
        }
        return 0;
    };

    var getLogic = {};
    getLogic.winState = "";
    getLogic.makeAnswer = function(x, y) {
        var that = this;
        curState[x][y] = maxPlayer;
        checkWin();
        if (win){
            that.winState = "you win";
            return "";
        }
        var answ = [-1, -1];
        var c = getChilds(curState, maxPlayer);
        var maxChild = -1;
        var maxValue = Number.MIN_VALUE;
        for (var k = 0; k < c.length; k++) {
            var curValue = miniMax(c[k], 0, -maxPlayer, curState);
            if (complexity > 1) {
            //var curValue2 = miniMax(c[k], complexity - 1, -maxPlayer, curState);
            //use it for more complex game!
            }
            if (maxValue < curValue) {
                maxValue = curValue;
                maxChild = k;
            }
        }
        for (var i = 0; i < cellsCount; i++) {
            for (var j = 0; j < cellsCount; j++) {
                if (c[maxChild][i][j] != curState[i][j]) {
                    answ[0] = i;
                    answ[1] = j;
                    curState[answ[0]][answ[1]] = -maxPlayer;
                    checkWin();
                    if (win) {
                        that.winState = "you lost";
                    }
                    return answ;
                }
            }
        }
        return answ;
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

    document.getElementById("7-7").classList.add("boardCellCross");
    var currValue = -1; // player - O, computer - X
    var gameOver = false;

    document.querySelectorAll('div.boardCol').forEach(boardColumn => {
        boardColumn.addEventListener('mousedown', handleMouseDown);
    })
    function handleMouseDown(e){
        if(gameOver) return "";
        var cell = $(this);
        if (cell.children().hasClass("boardCellCircle")) return "";
        if (cell.children().hasClass("boardCellCross")) return "";
        var indexes = (cell.children().attr('id')).split("-");
        var answer = logic.makeAnswer(indexes[0],indexes[1]);
        if(answer !== ""){
            var getedId = answer[0] + '-' + answer[1];
            document.getElementById(getedId).classList.add(deserve());
        } else currValue *= -1;
        cell.children().addClass(deserve());
        function deserve(){
            currValue *= -1;
            if (currValue === 1) {
                return "boardCellCross";
            }
            return "boardCellCircle";
        }
        if (logic.winState !== ""){
            var message = document.getElementById("message");
            message.textContent = logic.winState;
            gameOver = true;
            message.classList.remove("looseState");
            if (logic.winState === "you lost"){
                message.classList.add("looseState");
            }
        }
    }

    document.getElementById("scale-Up").addEventListener("click", handleScale);
    document.getElementById("scale-Down").addEventListener("click", handleScale);
    function handleScale(e){
        var value = 100;
        var minValue = 300;
        var delta =  e.target.id.split("-")[1];
        var board = document.querySelector(".board");
        var controls = document.querySelector(".controls");
        if (delta === "Up"){
            board.style.width = (board.offsetWidth + value) + 'px';
            board.style.height = (board.offsetHeight + value) + 'px';
            controls.style.width = (controls.offsetWidth + value) + 'px';
            controls.style.height = (controls.offsetHeight + value/15) + 'px';
        }
        if (delta === "Down" && board.offsetWidth > minValue){
            board.style.width = (board.offsetWidth - value) + 'px';
            board.style.height = (board.offsetHeight - value) + 'px';
            controls.style.width = (controls.offsetWidth - value) + 'px';
            controls.style.height = (controls.offsetHeight - value/15) + 'px';
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
        document.getElementById("message").textContent = "";
        if (index === "O"){
            logic = new Logic();
            document.getElementById("7-7").classList.add("boardCellCross");
            currValue = -1;
        }
        if (index === "X"){
            logic = new Logic(1);
            currValue = 1;
        }
        document.getElementById("check").checked = false;
    }
});