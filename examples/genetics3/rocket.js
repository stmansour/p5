/*jshint esversion: 6 */

class Rocket {
    constructor(dna) {
        this.reset();
        this.rectMode = CENTER;
        this.id = app.UID;
        app.UID++;
        if (typeof dna === "undefined") {
            this.dna = new DNA();
        } else {
            this.dna = dna;
        }
        this.done = false;
        this.width = 5;
        this.height = 25;
        this.cycles = -1;   // how many cycles does it take to reach the goal. only valid if done == true
        this.hitObstacle = false;
    }

    reset() {
        this.pos = createVector(width/2,height);  // position
        this.vel = createVector();  // velocity
        this.acc = createVector();  // acceleration
        this.fitness = 0;
    }

    applyForce(f) {
        this.acc.add(f);
    }

    update() {
        if (!this.done) {
            this.applyForce(this.dna.genes[app.cycle]);
            this.vel.add(this.acc);
            this.pos.add(this.vel);
            this.acc.mult(0);
        }
    }

    show() {
        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.vel.heading());
        rectMode(this.rectMode);
        noStroke();
        fill(255,180);
        rect(0,0, 25,5);
        pop();

        // did it reach its goal?
        if (!this.done) {
            let d = this.distanceToTarget();
            if (d < app.targetDiameter) {
                this.done = true;  // this rocket has achieved its goal
                this.cycles = app.cycle;
                this.calculateFitness();
                this.fitness *= 10;
                this.fitness += (app.lifespan - app.cycle); // this bonus rewards those who make it in fewer cycles
            }
        }

        // did it run into an obstacle?
        if (!this.hitObstacle) {
            if (app.obstacles.overlap(this)) {
                this.hitObstacle = true;
                this.done = true;
                this.fitness = .1; // not zero, but not good
            }
        }

        // did it hit the edge of the screen?

    }

    calculateFitness() {
        this.fitness = map( this.distanceToTarget(),0,width,width,0);
    }

    distanceToTarget() {
        return dist(app.targetx,app.targety,this.pos.x,this.pos.y);
    }

    makeChild(p) {
        let childDNA = this.dna.crossover(p.dna);
        return new Rocket(childDNA);
    }
}
