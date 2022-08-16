/*jshint esversion: 6 */
function Shot(x,y) {
    this.x = x;
    this.y = y;
    this.expired = false;  // turns true when the shot gets to the top of the screen or when we hit something

    this.show = function() {
        fill(255);
        noStroke();
        rect(this.x,this.y,2,10);
    };

    this.move = function() {
        this.y -= 4;
        this.expired = this.y <= app.topBar;
    };
}
