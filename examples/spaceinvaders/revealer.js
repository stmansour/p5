/*jshint esversion: 6 */

class Revealer {
    constructor(s,x,y,d) {
        this.x = x;
        this.y = y;
        this.s = s;         // string to display
        this.d = d;         // delay between characters in msec
        this.tmr = null;    // timer info
        this.amt = 1;       // amount of original string to show
        this.str = "";      // current string to show, grows over time
    }

    go() {
        this.tmr = setInterval(() => {
            // check for completion
            if (this.amt == this.s.length) {
                this.clear();
                return;
            }
            // advance to next character
            this.amt++;
            this.str = this.s.substr(0,this.amt);
        },  this.d );
    }

    clear() {
        if (this.tmr != null) {
            clearInterval(this.tmr);
            this.tmr = null;
        }
    }

    show() {
        text(this.str, this.x,this.y);
    }

}
