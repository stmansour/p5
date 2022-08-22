/*jshint esversion: 6 */

class Population {
    constructor(size) {
        this.p = [];
        // this.bestFitness
        for (var i = 0; i < size; i++) {
            this.p.push(new DNA(i));
        }
    }

    fitness() {
        let j = 0;
        for (let i = 0; i < this.p.length; i++) {
            this.p[i].determineFitness();
            if (this.p[i].fitness > this.p[j].fitness) {
                j = i;
            }
        }
        app.bestDNA = this.p[j].genes;
        app.bestFitness = this.p[j].fitness;
    }
}
