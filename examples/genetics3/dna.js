/* jshint esversion: 6 */

// Very simple dna:
//    the rockets will live for 200 frames
//    the dna has 200 genes
//    each gene is a direction to use in the corresponding frame

class DNA {
    constructor(genes) {
        if (typeof genes === "undefined") {
            this.genes = [];
            for (let i = 0; i < app.lifespan; i++) {
                this.genes[i] = p5.Vector.random2D();
            }
        } else {
            this.genes = genes;
        }
    }

    mutate(genes) {
        for (let i = 0; i < this.genes.length; i++) {
            // assume 1% chance for mutation
            if (random() < 0.01 ) {
                genes[i] = p5.Vector.random2D();
            }
        }
    }

    crossover(d) {
        let genes = [];
        var pivot = floor(random(this.genes.length));
        for (let i = 0; i < this.genes.length; i++) {
            genes[i] = (i > pivot) ? this.genes[i] : d.genes[i];
        }
        this.mutate(genes);
        return new DNA(genes);
    }
}
