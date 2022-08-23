/*jshint esversion: 6 */

class Population {
    constructor(size) {
        this.p = [];
        this.best= null;
        this.matingPool = [];
        this.generations = 0;
        for (var i = 0; i < size; i++) {
            this.p.push(new DNA(i));
        }
        this.determineFitness();
    }

    determineFitness() {
        let j = 0;
        for (let i = 0; i < this.p.length; i++) {
            this.p[i].determineFitness();
            if (this.p[i].fitness > this.p[j].fitness) {
                j = i;
            }
        }
        this.best = this.p[j];
    }

    createMatingPool() {
        this.matingPool = [];
        for (let i = 0; i < this.p.length; i++) {
            let n = floor(this.p[i].fitness * 100);  // n is now an integer between 0 and 100
            for (let j = 0; j < n; j++) {
                this.matingPool.push(this.p[i]);
            }
        }
    }

    createNextGeneration() {
        let newpop = [];
        for (let i = 0; i < this.p.length; i++) {
            let parents = this.chooseParents();
            let kid = parents[0].crossover(parents[1]);
            kid.mutate();
            kid.id = i; // crossover does not name the kid
            newpop.push(kid);
        }
        this.p = newpop;
        this.generations++;
    }

    chooseParents() {
        let mom = null;
        let dad = null;
        do {
            mom = this.matingPool[floor(random(this.matingPool.length))];
            dad = this.matingPool[floor(random(this.matingPool.length))];
        } while (mom.id == dad.id);  // if we happened to pick the same parents, try again
        return [mom, dad];
    }

    sortBest() {
        this.p.sort((a,b) => {
            if (a.fitness > b.fitness) {
                return -1;
            } else if (a.fitness < b.fitness) {
                return 1;
            }
            return 0;
        });

    }


}
