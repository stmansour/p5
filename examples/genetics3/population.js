/* jshint esversion: 6 */
class Population {
    constructor() {
        this.fleet = [];
        this.fleetsize = app.populationSize;
        this.matingPool = [];
        this.generation = 0;
        this.best = null;
        for (let i = 0; i < this.fleetsize; i++) {
            this.fleet[i] = new Rocket();
        }
    }

    run() {
        for (let i = 0; i < this.fleet.length; i++) {
            this.fleet[i].update();
            this.fleet[i].show();
        }
    }

    reset() {
        for (let i = 0; i < this.fleet.length; i++) {
            this.fleet[i].reset();
        }
    }

    collectResults() {
        let results = {
            generation: this.generation,
            success: 0,
            best: null,
        };
        let maxfit = 0;
        for (let i = 0; i < this.fleet.length; i++) {
            if (this.fleet[i].done && !this.fleet[i].hitObstacle) {
                results.success++;
            }
            if (this.fleet[i].fitness > maxfit) {
                maxfit = this.fleet[i].fitness;
                this.best = this.fleet[i];
            }
        }
        results.best = this.best;
        return results;
    }

    calculateFitness() {
        let maxfitness = 0;
        for (let i = 0; i < this.fleet.length; i++) {
            this.fleet[i].calculateFitness();
            if (this.fleet[i].fitness > maxfitness) {
                maxfitness = this.fleet[i].fitness;
            }
        }
        for (let i = 0; i < this.fleet.length; i++) {
            this.fleet[i].fitness /= maxfitness;  // this normalizes everything from 0 to 1
        }
    }

    createMatingPool() {
        this.matingPool = [];
        for (let i = 0; i < this.fleet.length; i++) {
            let n = floor(this.fleet[i].fitness * 100);     // best fit will have 100 and it goes down from there
            for (let j = 0; j < n; j++) {
                this.matingPool.push(this.fleet[i]);
            }
        }
    }

    nextGeneration() {
        this.calculateFitness();
        this.createMatingPool();
        for (var i = 0; i < this.fleetsize; i++) {
            let parents = this.chooseParents();
            this.fleet[i] = parents[0].makeChild(parents[1]);
        }

        // ensure that the best of the generation carries forward
        if (this.best != null) {
            this.fleet[this.fleetsize] = new Rocket(this.best.DNA);
        }
        this.generation++;
    }


    // ensures the parents are different objects
    chooseParents() {
        let mom = null;
        let dad = null;
        do {
            mom = this.matingPool[floor(random(this.matingPool.length))];
            dad = this.matingPool[floor(random(this.matingPool.length))];
        } while (mom.id == dad.id);  // if we happened to pick the same parents, try again
        return [mom, dad];
    }
}
