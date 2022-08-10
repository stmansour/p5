function Shots() {
    this.shots = [];

    this.fire = function() {
        let shot = new Shot(app.laserCannon.x,app.laserCannon.y);
        this.shots.push(shot);
    };

    this.show = function() {
        for (var i = 0; i < this.shots.length; i++) {
            this.shots[i].show();
            this.shots[i].move();
            if (this.shots[i].expired) {
                this.shots.splice(i,1);
            }
        }
    };
}
