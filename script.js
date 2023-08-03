function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    col = Math.floor(width / 10);
    row = Math.floor(height / 10);
    field = new Array(col * row);
    for(var i = 0; i < 1000; i++) {
        particles[i] = new Particle();
    }
    background(0);
}
var showfield = false;
var clicked = false;
function mouseClicked() {
    clicked = true;
}
var particleColor;
var col;
var row;
var zoffset = 0;
var particles = [];
var field;
class Particle {
    constructor() {
        this.pos = new createVector(Math.random() * width, Math.random() * height);
        this.vel = new createVector(0, 0);
        this.acc = new createVector(0, 0);
        this.ppos = this.pos.copy();
    }
    update() {
        this.vel.add(this.acc);
        this.vel.limit(4);
        this.pos.add(this.vel);
        this.acc.mult(0);
    }
    flow(field) {
        var x = floor(this.pos.x / 10);
        var y = floor(this.pos.y / 10);
        var index = x + y * col;
        var force = field[index];
        this.apply(force);
    }
    apply(force) {
        this.acc.add(force)
    }
    updateppos() {
        this.ppos.x = this.pos.x;
        this.ppos.y = this.pos.y;
    }
    constrain() {
        if(this.pos.x > width) {
            this.pos.x = 0;
            this.updateppos();
        }
        if(this.pos.x < 0) {
            this.pos.x = width;
            this.updateppos();
        }
        if(this.pos.y > height) {
            this.pos.y = 0;
            this.updateppos();
        }
        if(this.pos.y < 0) {
            this.pos.y = height;
            this.updateppos();
        }
    }
    display() {
        stroke(particleColor);
        strokeWeight(1);
        if(showfield === true) {
            stroke(255, 255, 255, 150);
            strokeWeight(5);
        }
        line(this.pos.x, this.pos.y, this.ppos.x, this.ppos.y);
        this.updateppos();
    }
}
function draw() {
    particleColor = color(205 + Math.random() * 50, 205 + Math.random() * 50, 205 + Math.random() * 50, 1 + Math.random() * 30);
    if(showfield === true) {
        background(20);
    }
    var yoffset = 0;
    for(var y = 0; y < row; y++) {
        var xoffset = 0;
        for(var x = 0; x < col; x++) {
            var index = x + y * col;
            var angle = noise(xoffset, yoffset, zoffset) * 2 * Math.PI * 4;
            var vector = new p5.Vector.fromAngle(angle);
            vector.normalize();
            field[index] = vector;
            xoffset += 0.1;
            if(showfield === true) {
                stroke(255, 50);
                push();
                translate(x * 10, y * 10);
                rotate(vector.heading());
                strokeWeight(1);
                line(0, 0, 10, 0);
                pop();
            }
        }
        yoffset += 0.1;
        zoffset += 0.00005;
    }
    for(var i = 0; i < particles.length; i++) {
        particles[i].flow(field);
        particles[i].update();
        particles[i].constrain();
        particles[i].display();
    }
    
    if(clicked === true && showfield === false) {
        showfield = true;
        clicked = false;
    }
    if(clicked === true && showfield === true) {
        showfield = false;
        clicked = false;
        background(0);
    }
}