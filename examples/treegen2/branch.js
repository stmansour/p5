function Branch(vec1,vec2) {
    this.begin = vec1;
    this.end = vec2;
    this.branched = false;  // has this branch been branched out at its endpoint
    this.jitter = 1;
    this.wobble = 1;
    this.strokeWeight = 1;

    this.show = function() {
        stroke(255);
        var j1x = 0;
        var j2x = 0;
        var j1y = 0;
        var j2y = 0;
        if (app.jitter) {
            j1x = random(-this.jitter,this.jitter);
            j1y = random(-this.jitter,this.jitter);
            j2x = random(-this.jitter,this.jitter);
            j2y = random(-this.jitter,this.jitter);
        }
        if (app.wobble) {
            this.begin.x += random(-this.jitter,this.jitter);
            this.begin.y += random(-this.jitter,this.jitter);
            this.end.x += random(-this.jitter,this.jitter);
            this.end.y += random(-this.jitter,this.jitter);
        }
        strokeWeight(this.strokeWeight);
        line(this.begin.x + j1x, this.begin.y + j1y, this.end.x + j2x, this.end.y + j2y);
    };

    // attach 2 new branches (a and b) to the end of this branch
    // and adds these two new branches to the supplied array.
    //------------------------------------------------------------------
    this.branchOut = function(a) {
        for (var i = -1; i <= 1; i += 2) {
            let b = p5.Vector.sub(this.end, this.begin);
            b.rotate(i * app.branchRotation);
            b.mult(app.branchDecay);
            let newEnd = p5.Vector.add(this.end,b);
            let newBranch = new Branch(this.end,newEnd);
            a.push(newBranch);
        }
        this.branched = true;  // ensure that we don't branch it again
    };

    this.mag = function() {
        let x = p5.Vector.sub(this.end,this.begin);
        return x.mag();
    };

    this.thickness = function(t) {
        this.strokeWeight = t;
    }
}
