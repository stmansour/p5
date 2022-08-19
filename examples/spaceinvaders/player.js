class Player {
    constructor(c) {
        this.name = "<1>";
        this.score = 0;
        this.credits = c;
        this.lives = 0;
        this.wavesCompleted = 0;
        this.gamesWon = 0;
        this.waveTop = 100;  // gets bigger every time the player wins a wave
    }

    newGame() {
        this.credits -= 1;
        this.score = 0;
        this.lives = 3;
    }
}
