/*jshint esversion: 6 */

let app = {
    width: 800,
    height: 500,
};

function setup() {
  let c = createCanvas(app.width, app.height);
  c.parent('theCanvas');

}

function draw() {
  background(220);
}
