/*jshint esversion: 6 */

class Rocket {
    constructor() {
        this.reset();
        this.dna = new DNA();
    }

    reset() {
        this.pos = createVector(width/2,height);  // position
        this.vel = createVector();  // velocity
        this.acc = createVector();  // acceleration
    }

    applyForce(f) {
        this.acc.add(f);
    }

    update() {
        this.applyForce(this.dna.genes[app.idx]);

        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0);
    }

    show() {
        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.vel.heading());
        rectMode(CENTER);
        noStroke();
        fill(255,180);
        rect(0,0, 25,5);
        pop();
    }
}
