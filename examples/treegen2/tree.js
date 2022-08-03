function Tree() {
    this.a = [];
    this.growCompleted = false;
    this.branchThicknessSet = 0;

    this.show = function() {
        for (var i = 0; i < this.a.length; i++) {
            this.a[i].show();
        }
    };

    this.grow = function() {
        if (this.growCompleted) {
            if (this.branchThicknessSet == 0) {
                for (let i = 0; i < this.a.length; i++) {
                    let t = map(i, 0, this.a.length-1, 10,1)
                    this.a[i].thickness(floor(t));
                }
            }
            return;
        }
        if (this.a.length == 0) {
            // start the tree...
            let a = createVector(app.width/2, app.height);  // bottom center
            let b = createVector(app.width/2, app.height  - app.initialBranchLen);
            let c = new Branch(a,b);
            this.a.push(c);   // first branch added to tree
            return;
        }

        let idx = this.a.length - 1;
        if (this.a[idx].mag() < app.minBranchLen) {
            this.growCompleted = true;
            return;  // grow no further
        }

        for (var i = idx; i >= 0; i--) {
            if (!this.a[i].branched) {
                this.a[i].branchOut(this.a);
            }
        }
    };
}
