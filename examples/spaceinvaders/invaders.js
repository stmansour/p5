function Invaders() {
    this.wing = [];   // in the airforce, a "wing" is a group of squadrons
    this.speed = 1;   // number of pixels to move left or right. Increases as number of players decreases

    this.squadbuilder = function(i1,i2,y) {
        let squadron = new Squadron(i1,i2,y);
        squadron.init();
        this.wing.push(squadron);
    }

    this.setSpeed = function(x) {
        for (var i = 0; i < this.wing.length; i++) {
            this.wing[i].speed = x;
        }
        this.speed = x;
    }

    this.init = function() {
        let y = 50;
        let y1 = 70;
        this.squadbuilder(app.c1,app.c2,y);
        this.squadbuilder(app.a1,app.a2,y+y1);
        this.squadbuilder(app.a1,app.a2,y+2*y1);
        this.squadbuilder(app.b1,app.b2,y+3*y1);
        this.squadbuilder(app.b1,app.b2,y+4*y1);
    }

    this.show = function() {
        for (var i = 0; i < this.wing.length; i++) {
            let squadron = this.wing[i];
            squadron.show();
        }
    }
}
