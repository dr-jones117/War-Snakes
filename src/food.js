// 1 over .....
export const SUPER_FOOD_CHANCE = 5; 

export class Food {
    static amountOfNutrition = 2;
    constructor() {
        this.classStyleName = "food-cell";
        this.row;
        this.column;
    }
}

export class SuperFood extends Food {
    static amountOfNutrition = 10;
    constructor() {
        super();
        this.classStyleName = "super-food-cell";
    }
}