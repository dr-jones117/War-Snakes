import { placeObjectRandomlyOnTable } from "./main";
import { getRandomIntegerInRange } from "./helper";

// 1 over this
export const SUPER_FOOD_CHANCE = 4; 
// 1 over this
const CHANCE_TO_SPAWN_FOOD_THIS_FRAME = 10;
const MAX_AMOUNT_OF_FOOD = 30;
const START_AMOUNT_OF_FOOD = 10;
var amountOfFood = 0;

export class Food {
    static amountOfNutrition = 5;
    constructor() {
        this.classStyleName = "food-cell";
        this.row;
        this.column;
    }
}

export class SuperFood extends Food {
    static amountOfNutrition = 15;
    constructor() {
        super();
        this.classStyleName = "super-food-cell";
    }
}

export function spawnInitialFood() {
    for(var i = 0; i < START_AMOUNT_OF_FOOD; i++) {
        spawnPieceOfFood();
    }
}

export function attemptToSpawnFood() {
    if(amountOfFood >= MAX_AMOUNT_OF_FOOD) return;

    //spawn the food 1 / 10 of the time
    var chanceToSpawnFood = getRandomIntegerInRange(0, CHANCE_TO_SPAWN_FOOD_THIS_FRAME);
    if(chanceToSpawnFood == 1) {
        spawnPieceOfFood();
    }
}

export function decreaseFood() {
    amountOfFood--;
}

function spawnPieceOfFood() {
    var pieceOfFood;
    var chanceToSpawnSuperFood = getRandomIntegerInRange(0, SUPER_FOOD_CHANCE);
    if(chanceToSpawnSuperFood == 0) {
        pieceOfFood = new SuperFood();
    } else {
        pieceOfFood = new Food();
    }
    placeObjectRandomlyOnTable(pieceOfFood);
    amountOfFood++;
}

