/*jshint esversion: 6 */
var app = {
    width: 800,
    height: 400,
    phrase: "Approaching like a drowning wall of love",
    // phrase: "I'm the twenty dollar man",
    population: null,
    populationSize: 500,
    mutationRate: 0.009,
    bestDNA: "",
    bestFitness: 0,
    gen0BestDNA: "",
    displayPopCount: 5,
};

function setup() {
    app.population = new Population(app.populationSize);
    app.gen0BestDNA = app.population.best.genes;
}

function draw() {
    showPopulation(app.displayPopCount);  // show what we got

    // compute fitness
    app.population.determineFitness();
    app.bestDNA = app.population.best.genes;
    app.bestFitness = app.population.best.fitness;

    updateUI();
    if (app.bestFitness > 0.999999) {
        app.population.sortBest();
        showPopulation(app.displayPopCount);
        noLoop();
        return;
    }

    // create next generation:
    //     pick two parents at random, have them produce and offspring
    app.population.createMatingPool();
    app.population.createNextGeneration();
}


function showPopulation(n) {
    let s = "";
    for (let i = 0; i < n; i++) {
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
    setInnerHTML("generations", app.population.generations);
    setInnerHTML("bestDNA", app.bestDNA);
    setInnerHTML("mutationRate", ((app.mutationRate * 100).toFixed(2)) + "%" );
    setInnerHTML("bestFitness",'' + app.bestFitness + ((app.bestFitness == 1) ? "  *** GOAL REACHED! ***" : ""));
    setInnerHTML("gen0BestDNA",app.gen0BestDNA);
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
