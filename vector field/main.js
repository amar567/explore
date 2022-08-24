function drawArrow(base, vec, myColor) {
    push();
    stroke(myColor);
    strokeWeight(1);
    fill(myColor);
    translate(base.x, base.y);
    line(0, 0, vec.x, vec.y);
    rotate(vec.heading());
    let arrowSize = 7;
    translate(vec.mag() - arrowSize, 0);
    triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
    pop();
}

let WIDTH = window.innerWidth
let HEIGHT = window.innerHeight

let url_string = window.location.href
let url = new URL(url_string);

let DX = url.searchParams.get("dx")||'x-y'
let DY = url.searchParams.get("dy")||'x+y'

const points = [];
let movingPoints = []

let dx = (x_,y_)=>{
    let x = x_-WIDTH/2
    let y = y_-HEIGHT/2

    return eval(DX)
}

let dy = (x_,y_)=>{
    let x = x_-WIDTH/2
    let y = y_-HEIGHT/2
    
    return eval(DY)
}

class Point {
    constructor(x,y) {
      this.position = createVector(x, y);
    }
    update(){
        this.position.x += dx(this.position.x,this.position.y)/50
        this.position.y += dy(this.position.x,this.position.y)/50
    }
    show(){
        point(this.position.x,this.position.y)
        stroke("white")
        strokeWeight(10)
    }
}

function setup() {
    createCanvas(WIDTH,HEIGHT);

    for (let i = 0; i < WIDTH/15; i++) {
        for (let j = 0; j < HEIGHT/15; j++) {
            let x = i*15
            let y = j*15

            let d_x = dx(x,y)
            let d_y = dy(x,y)

            points.push([x,y,d_x,d_y])
        }
    }
}

function draw() {
    background(0);
    let center = createVector(WIDTH/2,HEIGHT/2)
    for (let i = 0; i < points.length; i++) {
        let position = createVector(points[i][0],points[i][1])
        let flowVector = createVector(points[i][2],points[i][3])
        let n = Math.trunc(flowVector.mag()/center.mag()*255)
        flowVector.setMag(20)
        drawArrow(position,flowVector, [n,0,255-n])
    }

    let movingPoints_ = movingPoints
    for (let i = 0; i < movingPoints_.length; i++) {

        movingPoints_[i].update()
        movingPoints_[i].show()    

        if (movingPoints_[i].position.x<0||movingPoints_[i].position.y<0||movingPoints_[i].position.x>width||movingPoints_[i].position.y>height) {
            movingPoints_.splice(i, 1);
        }
    }
    movingPoints = movingPoints_
}

function mouseClicked(event) {
    movingPoints.push(new Point(mouseX, mouseY))
}