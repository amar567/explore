class Fly {
    constructor(x, y, speedx,accl, blinkPhase, blinkState, visionDirection) {
        this.x = x;
        this.y = y;
        this.speedx = speedx;
        this.speedy =  speedx;
        this.acclx = accl;
        this.accly = accl;
        this.blinkPhase = blinkPhase;
        this.blinkState = blinkState;
        this.visionDirection = visionDirection;
        this.lastUpdate = new Date().getTime();
    }

    edges() {
        if (this.x > width) {
          this.x = 0;
        } else if (this.x < 0) {
          this.x = width;
        }
        if (this.y > height) {
          this.y = 0;
        } else if (this.y < 0) {
          this.y = height;
        }
    }

    kuramotoSpeed(arrayOfFlies) {
      // find the neighbors
      let neighbors = []
      for (let other of arrayOfFlies){
        if (dist(this.x,this.y,other.x,other.y)<FIELD_OF_VISION) {
          neighbors.push(other)
        }
      }
      
      let ω = BLINK_FREQUENCY*TIME_SPEED_FACTOR/1000 * Math.PI

      // find the modification that should be done to the blink phase
      let sum_of_sines = 0
      for (let neighbor of neighbors){
        sum_of_sines += Math.sin(neighbor.blinkPhase - this.blinkPhase)
      }
      let ω2 = ω + COUPLING_CONSTANT*sum_of_sines
      return ω2
    }

    update(arrayOfFlies) {

        // BLINKING PART---------------

            // phase modification based on time 
            let time = new Date().getTime();
            let dt = time - this.lastUpdate;
            this.lastUpdate = time;

            // this.blinkPhase += dt*BLINK_FREQUENCY*TIME_SPEED_FACTOR/1000 * Math.PI;

            // blink-state modification based on phase
            this.blinkState = Math.sin(this.blinkPhase) > 0.99;

            // phase modification based on local blink phase
            this.blinkPhase += dt*this.kuramotoSpeed(arrayOfFlies)


        // POSITION PART-------------

            // position modification based on speed
            this.x += this.speedx;
            this.y += this.speedy;

            // speed modification at random - temporary
              // this.speedx = (1-2*Math.random());
              // this.speedy = (Math.random()*2-1)*Math.sqrt(FLY_SPEED**2 - this.speedx**2);
              this.speedx += (Math.random()*2-1)*this.acclx * (0.01)
              this.speedy += (Math.random()*2-1)*this.accly * (0.01)
            // console.log(this.speedx, this.speedy);

            // avoid edges
            this.edges();
    }

    show() {
        strokeWeight(8);
        if (this.blinkState === true) {
            stroke(255, 255, 0);
        } else {
            stroke(	128, 128, 128);
        }
        point(this.x, this.y);
    }
}