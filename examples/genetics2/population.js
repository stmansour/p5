/* jshint esversion: 6 */
class Population {
    constructor() {
        this.fleet = [];
        this.fleetsize = 100;
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
}
