/*jshint esversion: 6 */
var app = {
    width: 800,
    height: 400,
    phrase: "Approaching like a drowning wall of love",
    population: null,
    populationSize: 500,
    generations: 0,
    mutationRate: 0.009,
    bestDNA: "",
    bestFitness: 0,
};

function newPopulation() {
    app.population = new Population(this.populationSize);
}

function setup() {
    newPopulation();
}

function draw() {
    showPopulation();  // show what we got

    // compute fitness
    let j = 0;
    for (let i = 0; i < app.population.length; i++) {
        app.population.p[i].determineFitness();
        if (app.population.p[i].fitness > app.population.p[j].fitness) {
            j = i;
        }
    }
    app.bestDNA = app.population.p[j].genes;
    app.bestFitness = app.population.p[j].fitness;
    updateUI();
    if (app.bestFitness > 0.999999) {
        app.population.sort((a,b) => {
            if (a.fitness > b.fitness) {
                return -1;
            } else if (a.fitness < b.fitness) {
                return 1;
            }
            return 0;
        });
        showPopulation();
        noLoop();
        return;
    }

    // create a mating pool
    let matingPool = [];
    for (let i = 0; i < app.population.length; i++) {
        let n = floor(app.population.p[i].fitness * 100);  // n is now an integer between 0 and 100
        for (let j = 0; j < n; j++) {
            matingPool.push(app.population.p[i]);
        }
    }

    // create next generation:
    //     pick two parents at random, have them produce and offspring
    let newpop = [];
    for (let i = 0; i < app.population.length; i++) {
        let parents = chooseParents(matingPool);
        let kid = parents[0].crossover(parents[1]);
        kid.mutate();
        kid.id = i; // crossover does not name the kid
        newpop.push(kid);
    }
    app.population = newpop;
    app.generations += 1;

}


function chooseParents(p) {
    let mom = null;
    let dad = null;
    do {
        mom = p[floor(random(p.length))];
        dad = p[floor(random(p.length))];
    } while (mom.id == dad.id);  // if we happened to pick the same parents, try again
    return [mom, dad];
}

function showPopulation() {
    let s = "";
    for (let i = 0; i < 50; i++) {
        s += HtmlEncode(app.population.p[i].genes) + "<br>";
    }
    setInnerHTML("populationData",s);
}

function HtmlEncode(s) {
  var el = document.createElement("div");
  el.innerText = el.textContent = s;
  s = el.innerHTML;
  return s;
}

function setInnerHTML(id,s) {
    let el = document.getElementById(id);
    if (el != null) {
        el.innerHTML = s;
    }
}

function initUI() {
    // app.animationFrameRateSlider = createSlider(2,60,app.animationFrameRate,1);
    // app.animationFrameRateSlider.parent('animationFrameRateSlider');
    //
    // app.orderNSlider = createSlider(1,7,app.orderN,1);
    // app.orderNSlider.parent('orderNSlider');
    //
    // app.showCirclesCheckbox = createCheckbox("Show Circles", app.showCircles);
    // app.showCirclesCheckbox.parent('showCirclesCheckbox');
}

function updateUI() {
    setInnerHTML("targetPhrase", app.phrase);
    setInnerHTML("initialPopulation", app.populationSize);
    setInnerHTML("generations", app.generations);
    setInnerHTML("bestDNA", app.bestDNA);
    setInnerHTML("mutationRate", ((app.mutationRate * 100).toFixed(2)) + "%" );
    setInnerHTML("bestFitness",app.bestFitness);

    // app.showCircles = app.showCirclesCheckbox.checked();
    // // setInnerHTML("showCircles", "" + app.showCircles);
}

function setCharAt(str,index,chr) {
    if(index > str.length-1) {
        return str;
    }
    return str.substring(0,index) + chr + str.substring(index+1);
}

function checkUndefined(s) {
    if (s.includes("undefined")) {
        console.log("found undefined in: " + s);
    }
}
