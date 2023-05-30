import { SnakeBodyCell, Snake, snakes as playerSnakes, playerSnake } from "./snake.js";
import {Food, SuperFood, spawnInitialFood, attemptToSpawnFood, decreaseFood} from "./food.js";
import { getRandomIntegerInRange, isValueInDictionary, 
    getCellClassList, changeCellBrightness, isEmptyCell} from "./helper.js";
import { GameMode } from "./gamemode.js";

//constant variables
const MAX_HUMAN_PLAYERS = 4;
const MAX_DIFFICULTY = 8;

export const EMPTY_CELL_CLASS_NAME = 'empty-cell';
const ZERO = 0;

//add more lines to this dictionary to create more players.
const playerDictionary = {
    playerOne: { id: 1, classStyleName: 'snake-cell', keybinds: { up: 'w', right: 'd', down: 's', left: 'a' } },
    //playerTwo: { id: 2, classStyleName: 'snake-cell-two', keybinds: { up: 'ArrowUp', right: 'ArrowRight', down: 'ArrowDown', left: 'ArrowLeft' } },
    //playerThree: { id: 3, classStyleName: 'snake-cell', keybinds: { up: 'i', right: 'l', down: 'k', left: 'j' } },
    //playerFour: { id: 4, classStyleName: 'snake-cell-two', keybinds: { up: '5', right: '3', down: '2', left: '1' } }
};

//table variables
export var table = null;
var tableRows;
var tableColumns;

//other game variables
var intervalClock;
var isPaused = false;
var difficulty = 6;
var gameMode;

//event handler and function that deal with directional input for player snakes
document.addEventListener('keydown', updateSnakesDirections);
function updateSnakesDirections(event) {
    if (event.key.startsWith('Arrow')) {
        event.preventDefault(); // Prevent default scrolling behavior
    } 

    for (let [key, player] of Object.entries(playerDictionary)) {
        var snakeToUpdate = findSnakeWithID(player.id);
        if(snakeToUpdate == null) continue;
        if(!isValueInDictionary(event.key, player.keybinds) && 
            snakeToUpdate.directionSetForFrame == false) continue;

        if (event.key === player.keybinds.left && snakeToUpdate.direction != Snake.RIGHT)
            snakeToUpdate.direction = Snake.LEFT;
        else if (event.key === player.keybinds.up && snakeToUpdate.direction != Snake.DOWN)
            snakeToUpdate.direction = Snake.UP;
        else if (event.key === player.keybinds.right && snakeToUpdate.direction != Snake.LEFT)
            snakeToUpdate.direction = Snake.RIGHT;
        else if (event.key === player.keybinds.down && snakeToUpdate.direction != Snake.UP)
            snakeToUpdate.direction = Snake.DOWN;

        snakeToUpdate.directionSetForFrame = true;
    }
}

//the main function, creates and plays the game
function initializeSnakeGame(rows, columns) {
    //remove the start game button.
    var startGameButtom = document.getElementById("startGameButton");
    startGameButtom.remove();

    //build objects for the game.
    initializeTable(rows, columns);
    setupHumanPlayers();
    spawnInitialFood();
    gameMode = new GameMode(tableRows, tableColumns, playerSnakes);
    gameMode.checkForGameWin();
    //the game starts in a paused state, unpause it to set the clock.
    unpauseGame();
}

function findSnakeWithID(id) {
    for(var i = 0; i < playerSnakes.length; i++) {
        if(id == playerSnakes[i].id) return playerSnakes[i];
    }
}

function setupHumanPlayers() {
    var amountHumanPlayers = 0;
    for (let [key, player] of Object.entries(playerDictionary)) {
        if(amountHumanPlayers >= MAX_HUMAN_PLAYERS) return;
        
        var humanSnake = new playerSnake(player.id, player.classStyleName, player.keybinds);
        var initialBodyCell = new SnakeBodyCell();
        placeObjectRandomlyOnTable(initialBodyCell);
        humanSnake.body.push(initialBodyCell);
        playerSnakes.push(humanSnake);
        amountHumanPlayers++;
    }
}

function initializeTable(rows, columns) {
    //make it so the table can't be too small and set dimensional variables
    tableRows = Math.max(8, rows);
    tableColumns = Math.max(20, columns);

    //initialize the table
    table = document.createElement("table");
    table.classList.add("snake-table");

    //create the tables rows and columns
    for(var i = 0; i < tableRows; i++) {
        var row = document.createElement("tr");

        for(var j = 0; j < tableColumns; j++) {
            var cell = document.createElement("td");
            cell.classList.add(EMPTY_CELL_CLASS_NAME);
            row.appendChild(cell);
        }
        table.appendChild(row);
    }

    //add the table to the html
    var tableContainer = document.getElementById("snakeGameTable");
    tableContainer.appendChild(table);
}

//update this so that it 
export function placeObjectRandomlyOnTable(object) {
    var randomRow;
    var randomColumn;

    var emptyCell = false;
    while(emptyCell == false){
        randomRow = getRandomIntegerInRange(0, tableRows);
        randomColumn = getRandomIntegerInRange(0, tableColumns);

        emptyCell = isEmptyCell(randomRow, randomColumn);
    }

    changeCellClass(randomRow, randomColumn, object.classStyleName);
    object.row = randomRow;
    object.column = randomColumn;
}

function changeCellClass(row, column, newClass) {
    if (!table)
        return;

    var rows = table.getElementsByTagName("tr");
    if (row < rows.length) {
        var cells = rows[row].getElementsByTagName("td");
        if (column < cells.length) {
            cells[column].className = newClass;
        }
    }
}

function updateSnakeGame() {
    attemptToSpawnFood();

    for(var i = 0; i < playerSnakes.length; i++) {
        playerSnakes[i].directionSetForFrame = false;
        var currHeadRow = playerSnakes[i].body[0].row;
        var currHeadColumn = playerSnakes[i].body[0].column;

        switch (playerSnakes[i].direction) {
            case Snake.LEFT:
                currHeadColumn = currHeadColumn - 1;
                break;
            case Snake.UP:
                currHeadRow = currHeadRow - 1;
                break;
            case Snake.RIGHT:
                currHeadColumn = currHeadColumn + 1;
                break;
            case Snake.DOWN:
                currHeadRow = currHeadRow + 1;
                break;
        }
        if(currHeadColumn < ZERO) {
            currHeadColumn = tableColumns - 1;
        }
        else if(currHeadColumn > tableColumns - 1) {
            currHeadColumn = 0;
        }
        else if(currHeadRow < ZERO) {
            currHeadRow = tableRows - 1;
        }
        else if(currHeadRow > tableRows - 1) {
            currHeadRow = 0;
        }

        var classList = getCellClassList(currHeadRow, currHeadColumn);
        //check if food was eaten
        if(classList.contains("food-cell")) {
            playerSnakes[i].addedAmount += Food.amountOfNutrition;
            decreaseFood();
            increaseGameSpeed(0.1);
        } else if(classList.contains("super-food-cell")) {
            playerSnakes[i].addedAmount += SuperFood.amountOfNutrition;
            decreaseFood();            
            increaseGameSpeed(0.2);
        }
        //change the brightness if the snake is slithering over itself.
        if(classList.contains(playerSnakes[i].classStyleName)) {
            playerSnakes[i].hasHitItself = true;
            changeCellBrightness(currHeadRow, currHeadColumn, 50);
        } else {
            changeCellBrightness(currHeadRow, currHeadColumn, 100);
        }
        //check if the snake should be alive
        if(!classList.contains(EMPTY_CELL_CLASS_NAME) && !classList.contains("food-cell") && !classList.contains("super-food-cell") 
            && !classList.contains(playerSnakes[i].classStyleName)) {
            playerSnakes[i].isAlive = false;
            continue;
        }

        changeSnakeCellBodyClass(playerSnakes[i], EMPTY_CELL_CLASS_NAME);
        
        var bodyPart = new SnakeBodyCell(currHeadRow, currHeadColumn);
        playerSnakes[i].body.unshift(bodyPart);

        if(playerSnakes[i].addedAmount == 0) {
            playerSnakes[i].body.pop();
        } else {
            playerSnakes[i].addedAmount--;
        }
        changeSnakeCellBodyClass(playerSnakes[i]);
    }
    removeDeadSnakes();

    gameMode.checkGameConditions();
    if(gameMode.gameHasEnded) {
        pauseGame();
        console.log("game has ended!");
        gameMode.showStats();
    }
}

function removeDeadSnakes() {
    for(var i = 0; i < playerSnakes.length; i++) {
        if(playerSnakes[i].isAlive) continue;
        changeSnakeCellBodyClass(playerSnakes[i], EMPTY_CELL_CLASS_NAME);
        
        var index = playerSnakes.indexOf(playerSnakes[i]);
        if (index !== -1) {
            playerSnakes.splice(index, 1);
        }
        gameMode.setPlayerSnakes(playerSnakes);
    }
}

function changeSnakeCellBodyClass(snake, cellClass = snake.classStyleName) {
    for(var i = 0; i < snake.body.length; i++) {
        changeCellClass(snake.body[i].row, snake.body[i].column, cellClass);
    }
}

function pauseGameToggle() {
    if(isPaused) unpauseGame();
    else pauseGame();
}

function unpauseGame() {
    //update the game every fourth of a second divided by the difficulty
    intervalClock = setInterval(updateSnakeGame, 250 / difficulty);
    isPaused = false;
}

function pauseGame() {
    clearInterval(intervalClock);
    isPaused = true;
}

function increaseGameSpeed(additionalDifficulty) {
    difficulty = Math.min(difficulty + additionalDifficulty, MAX_DIFFICULTY);
    clearInterval(intervalClock);
    intervalClock = setInterval(updateSnakeGame, 250 / difficulty);
}

//add functionality to buttons
document.getElementById("startGameButton").addEventListener("click", function() {
    initializeSnakeGame(50, 120);
});

document.getElementById("pauseGameButton").addEventListener("click", function() {
    pauseGameToggle();
});