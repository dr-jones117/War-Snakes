export class GameMode {
    constructor(rows, columns, playerSnakes) {
        this.playerSnakes = playerSnakes;
        this.rows = rows;
        this.columns = columns;
        this.teams = {};

        //singleplayer
        if(this.playerSnakes.length == 1) {
            this.playerSnake = playerSnakes[0];
            this.checkForGameWin = this.#checkWinForSingleplayer;
            this.checkForGameLoss = this.#checkLossForSingleplayer;
            this.showStats = this.#showStatsForSingleplayer;
        } 
        //multiplayer
        else if(this.playerSnakes.length > 1) {
            this.checkForGameWin = this.#checkWinForMultiplayer;
            this.checkForGameLoss = this.#checkLossForMultiplayer;
            this.showStats = this.#showStatsForMultiplayer;
            this.#updateTeams();
        } 
    }

    setPlayerSnakes(snakes) {
        this.playerSnakes = snakes;
        this.#updateTeams();
    }

    checkGameConditions(){
        if(this.checkForGameWin() || this.checkForGameLoss()) {
            this.gameHasEnded = true;
        }
        else this.gameHasEnded = false;
    }

    #checkWinForSingleplayer() {
        if(this.playerSnake.body.length == (this.rows * this.columns)) {
            return true;
        }
        return false;
    }

    #checkLossForSingleplayer() {
        if(this.playerSnake.hasHitItself){
            return true;
        }
        return false;
    }

    #showStatsForSingleplayer() {
        console.log(this.playerSnake.body.length);
    }

    #checkWinForMultiplayer() {
        //if only 1 team has players on it, the game has ended
        var amountOfTeamsWithPlayers = 0;
        for (let [key, team] of Object.entries(this.teams)) {
            if(team.length > 0) {
                amountOfTeamsWithPlayers++;
            }
        }
        if(amountOfTeamsWithPlayers <= 1) {
            return true;
        }
        else return false;
    }

    #checkLossForMultiplayer() {
        return false;
    }

    #showStatsForMultiplayer() {
        console.log("showing stats for multiplayer");
    }

    #updateTeams() {
        var amountOfSnakes = this.playerSnakes.length;
        //reset the teams
        this.teams = {};
        //iterate through every player snake
        for(var i = 0; i < amountOfSnakes; i++) {
            //the team name is the class style
            var teamName = this.playerSnakes[i].classStyleName;
            //add the snake to the dictionary to the appropriate team
            if(this.teams[teamName] === null || this.teams[teamName] === undefined) {
                //init the array the for the team if it's not done already
                this.teams[teamName] = [];
            }
            this.teams[teamName].push(this.playerSnakes[i]);
        }
        console.log(this.teams);
    }
}