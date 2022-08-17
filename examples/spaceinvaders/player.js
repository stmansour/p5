class Player {
    constructor(c) {
        this.name = "<1>";
        this.score = 0;
        this.credits = c;
        this.lives = 0;
        this.wavesCompleted = 0;
        this.gamesWon = 0;
    }

    newGame() {
        this.credits -= 1;
        this.score = 0;
        this.lives = 3;
    }
}
