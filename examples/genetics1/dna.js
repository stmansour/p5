/*jshint esversion: 6 */

//  A trivial DNA class that supports:
//    * determining its fitness  (THIS PROBABLY BELONGS SOMEWHERE ELSE)
//    * crossover
//    * mutation
//============================================================================
class DNA {
    constructor(id) {
        this.fitness = 0;
        this.genes = '';
        if (typeof id === "undefined") {
            this.id = 0;
            this.genes = [];
        } else {
            this.id = id; // should be unique across all the DNA instances
            for (var i = 0; i < app.phrase.length; i++) {
                this.genes += String.fromCharCode(this.randomChar());
            }
        }
    }

    randomChar() {
        return floor(random(32,127));
    }

    determineFitness() {
        //  how many characters match the target phrase
        let score = 0;
        for (let i = 0; i < this.genes.length; i++) {
            if (this.genes[i] == app.phrase[i]) {
                score++;
            }
        }
        this.fitness = score/app.phrase.length;
    }

    crossover(d) {
        return this.crossover1(d);
    }

    crossover1(d) {
        let child = new DNA(); // we know its id is not unique, we'll name it later
        let gl = this.genes.length;
        for (let i = 0; i < gl; i++) {
            if (random() > 0.5) {
                child.genes += this.genes[i];
            } else {
                child.genes += d.genes[i];
            }
        }
        return child;
    }
    crossover2(d) {
        let child = new DNA(); // we know its id is not unique, we'll name it later
        let gl = this.genes.length;
        let m = gl/2;
        for (let i = 0; i < gl; i++) {
            if (i > m) {
                child.genes += this.genes[i];
            } else {
                child.genes += d.genes[i];
            }
        }
        return child;
    }

    mutate() {
        for (let i = 0; i < this.genes.length; i++) {
            if (random() < app.mutationRate) {
                let rc = this.randomChar();
                let s = this.genes.substring(0,i) + String.fromCharCode(rc);
                if (i < this.genes.length-1) {
                    s += this.genes.substring(i+1);
                }
                this.genes = s;
            }
        }
    }
}
