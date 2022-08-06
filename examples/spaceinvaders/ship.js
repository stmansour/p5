function Ship() {
    this.width = 40;
    this.height = 15;
    this.gunwidth = 4;
    this.gunheight = 10;
    this.x = width/2;
    this.y = height - this.height;

    this.show = function() {
        fill('#00ff00');
        noStroke();
        rect(this.x - this.width/2,this.y, this.width, this.height);
        rect(this.x - this.gunwidth/2, this.y - this.gunheight, this.gunwidth,this.gunheight);
    }
}
