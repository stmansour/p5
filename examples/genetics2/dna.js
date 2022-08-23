/* jshint esversion: 6 */

// Very simple dna:
//    the rockets will live for 200 frames
//    the dna has 200 genes
//    each gene is a direction to use in the corresponding frame

class DNA {
    constructor() {
        this.genes = [];
        for (let i = 0; i < app.lifespan; i++) {
            this.genes[i] = p5.Vector.random2D();
        }
    }
}
