class Boid {
    constructor() {
      this.position = createVector(random(width), random(height));
      this.theta = Math.random()*2*PI
      this.velocity = createVector()
      this.velocity.x = SPEED* Math.cos(this.theta)
      this.velocity.y = SPEED* Math.sin(this.theta)

      // console.log(this.theta,this.velocity);
    }
  
    edges() {
      if (this.position.x > width) {
        this.position.x = 0;
      } else if (this.position.x < 0) {
        this.position.x = width;
      }
      if (this.position.y > height) {
        this.position.y = 0;
      } else if (this.position.y < 0) {
        this.position.y = height;
      }
    }

    align(boids) {

      let sum_of_sines = 0
      let sum_of_cosines = 0

      for (let i = 0; i < boids.length; i++) {
        sum_of_sines += Math.round(Math.sin(boids[i].theta)*10000)/10000
        sum_of_cosines += Math.round(Math.cos(boids[i].theta)*10000)/10000
      }

      let avg_of_sines = sum_of_sines/boids.length
      let avg_of_cosines = sum_of_cosines/boids.length

      let delta_theta = (Math.random() - 0.5) *DELTA_THETA_MAX  // η

      // this.theta = Math.atan(avg_of_sines/avg_of_cosines) + delta_theta // equation 2 used here

      // arctan according to the quadrant of avg sine and cosine fall in
      if (avg_of_sines > 0 & avg_of_cosines > 0 ) {
        this.theta = Math.atan(avg_of_sines/avg_of_cosines ) + delta_theta // equation 2 used here
      }
      if (avg_of_sines > 0 & avg_of_cosines < 0 ) {
        this.theta = PI + Math.atan(avg_of_sines/avg_of_cosines ) + delta_theta // equation 2 used here
      }
      if (avg_of_sines < 0 & avg_of_cosines < 0 ) {
        this.theta = PI + Math.atan(avg_of_sines/avg_of_cosines ) + delta_theta // equation 2 used here
      }
      if (avg_of_sines < 0 & avg_of_cosines > 0 ) {
        this.theta = Math.atan(avg_of_sines/avg_of_cosines ) + delta_theta // equation 2 used here
      }

      this.velocity.x = SPEED* Math.cos(this.theta)
      this.velocity.y = SPEED* Math.sin(this.theta)

    }

    flock(boids) {

      let neighbors = []

      for (let other of boids) {
        let d = dist(
          this.position.x,
          this.position.y,
          other.position.x,
          other.position.y
        );
        if (d<PERCEPTION_RADIUS) {
          neighbors.push(other)          
        }
      }

      if (neighbors.length>0) {

        // alignment
          this.align(neighbors)
      }
    }

    update() {
      let next = createVector(this.velocity.x*0.1,this.velocity.y*0.1)
      this.position.add(next);
    }

    show() {
      strokeWeight(8);
      stroke(255);
      let arrow = createVector(15*Math.cos(this.theta),15*Math.sin(this.theta))
      drawArrow(this.position, arrow, 'white');
    }
  }