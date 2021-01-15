var row_no = 38;
var col_no = 100;

var playing = false;

var grid = new Array(row_no);
var next_grid = new Array(row_no);

var timer;
var reproduction_time = 100;

function initializeGrids() {
    for (var i = 0; i < row_no; i++) {
        grid[i] = new Array(col_no);
        next_grid[i] = new Array(col_no);
    }
}

function resetGrids() {
    for (var i = 0; i < row_no; i++) {
        for (var j = 0; j < col_no; j++) {
            grid[i][j] = 0;
            next_grid[i][j] = 0;
        }
    }
}

function copyResetGrid() {
    for (var i = 0; i < row_no; i++) {
        for (var j = 0; j < col_no; j++) {
            grid[i][j] = next_grid[i][j];
            next_grid[i][j] = 0;
        }
    }
}

function initialize() {
    createTable();
    initializeGrids();
    resetGrids();
    setUpControlButtons();
}

function createTable() {
    var grid_container = document.querySelector('.grid');
    if (!grid_container) {
        console.log('[-] Error: No div available to lay grid');
    }
    var table = document.createElement("table");

    for (var i = 0; i < row_no; i++) {
        var tr = document.createElement("tr");
        for (var j = 0; j < col_no; j++) {
            var cell = document.createElement("td");
            cell.setAttribute("id", i + "_" + j);
            cell.setAttribute("class", "dead");
            cell.onclick = cellClickHandler;
            tr.appendChild(cell);
        }
        table.appendChild(tr);
    }
    grid_container.appendChild(table);
}

function cellClickHandler() {
    var row_col = this.id.split("_");
    var row = row_col[0];
    var col = row_col[1];

    var classes = this.getAttribute("class");
    if (classes.indexOf("live") > -1) {
        this.setAttribute("class", "dead");
        grid[row][col] = 0;
    }
    else {
        this.setAttribute("class", "alive");
        grid[row][col] = 1;
    }
}

function updateView() {
    for (var i = 0; i < row_no; i++) {
        for (var j = 0; j < col_no; j++) {
            var cell = document.getElementById(i + "_" + j);
            if (grid[i][j] == 0) {
                cell.setAttribute("class", "dead");
            }
            else {
                cell.setAttribute("class", "alive");
            }
        }
    }
}

function setUpControlButtons() {
    // buttton START
    var start_button = document.querySelector('#start');
    start_button.addEventListener('click', startButtonHandler);

    // button RANDOM
    var random_button = document.querySelector('#random');
    random_button.addEventListener('click', randomButtonHandler);

    // button RESET
    var reset_button = document.querySelector('#reset');
    reset_button.addEventListener('click', resetButtonHandler);
}

// eventHandler for button START
function startButtonHandler() {
    if (playing) {
        console.log("[-] Message: Pause the Conway's game");
        playing = false;
        this.innerHTML = "Continue";
        clearTimeout(timer);
    }
    else {
        console.log("[-] Message: Continue the Conway's game");
        playing = true;
        this.innerHTML = "Pause";
        play();
    }
}

// eventHandler for button RANDOM
function randomButtonHandler() {
    if (playing) return;
    resetButtonHandler();
    console.log("[-] Message: Generate random alive cells");
    for (var i = 0; i < row_no; i++) {
        for (var j = 0; j < col_no; j++) {
            var is_alive = Math.round(Math.random());
            if (is_alive == 1) {
                var cell = document.getElementById(i + "_" + j);
                cell.setAttribute("class", "alive");
                grid[i][j] = 1;
            }
        }
    }
}

// eventHandler for button RESET
function resetButtonHandler() {
    console.log("[-] Message: Reset the Conway's game grid");
    playing = false;
    var start_button = document.querySelector('#start');
    start_button.innerHTML = "Start";
    clearTimeout(timer);

    var cell_list = document.querySelectorAll('.alive');
    var cells = [];
    for (var i = 0; i < cell_list.length; i++) {
        cells.push(cell_list[i]);
    }
    for (var i = 0; i < cells.length; i++) {
        cells[i].setAttribute("class", "dead");
    }
    resetGrids();
}

function play() {
    computeNextGen();

    if (playing) {
        timer = setTimeout(play, reproduction_time);
    }
}

function computeNextGen() {
    for (var i = 0; i < row_no; i++) {
        for (var j = 0; j < col_no; j++) {
            applyRules(i, j);
        }
    }

    copyResetGrid();
    updateView();
}

function applyRules(row, col) {
    var num_neighbors = countNeighbors(row, col);
    if (grid[row][col] == 1) {
        if (num_neighbors < 2) {
            next_grid[row][col] = 0;
        }
        else if (num_neighbors == 2 || num_neighbors == 3) {
            next_grid[row][col] = 1;
        }
        else if (num_neighbors > 3) {
            next_grid[row][col] = 0;
        }
    }
    else if (grid[row][col] == 0) {
        if (num_neighbors == 3) {
            next_grid[row][col] = 1;
        }
    }
}

function countNeighbors(row, col) {
    var count = 0;
    if (row - 1 >= 0) {
        if (grid[row - 1][col] == 1) count++;
    }
    if (row - 1 >= 0 && col - 1 >= 0) {
        if (grid[row - 1][col - 1] == 1) count++;
    }
    if (row - 1 >= 0 && col + 1 < col_no) {
        if (grid[row - 1][col + 1] == 1) count++;
    }
    if (col - 1 >= 0) {
        if (grid[row][col - 1] == 1) count++;
    }
    if (col + 1 < col_no) {
        if (grid[row][col + 1] == 1) count++;
    }
    if (row + 1 < row_no) {
        if (grid[row + 1][col] == 1) count++;
    }
    if (row + 1 < row_no && col - 1 >= 0) {
        if (grid[row + 1][col - 1] == 1) count++;
    }
    if (row + 1 < row_no && col + 1 < col_no) {
        if (grid[row + 1][col + 1] == 1) count++;
    }
    return count;
}

window.onload = initialize;
