/*jshint esversion: 6 */

class RandomPopulation {
    constructor(size) {
        this.p = [];
        this.best= null;
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

    createNextGeneration() {
        let newpop = [];
        for (let i = 0; i < this.p.length; i++) {
            this.p[i] = new DNA(i);
        }
        this.generations++;
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
