function Player(c) {
    this.name = "<1>";
    this.score = 0;
    this.credits = c;
    this.lives = 0;

    this.newGame = function() {
        this.credits -= 1;
        this.score = 0;
        this.lives = 3;
    }
}
