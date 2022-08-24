/*jshint esversion: 6 */

class Rocket {
    constructor(dna) {
        this.reset();
        this.id = app.UID;
        app.UID++;
        if (typeof dna === "undefined") {
            this.dna = new DNA();
        } else {
            this.dna = dna;
        }
        this.done = false;
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
        rectMode(CENTER);
        noStroke();
        fill(255,180);
        rect(0,0, 25,5);
        pop();

        if (!this.done) {
            let d = this.distanceToTarget();
            if (d < app.targetDiameter) {
                this.done = true;  // this rocket has achieved its goal
                this.calculateFitness();
                this.fitness *= (app.lifespan - app.cycle); // this bonus rewards those who make it in fewer cycles
            }
        }
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
