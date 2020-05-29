import CollisionBodySquare from '../engine/objects/collisionBodySquare';

import { globals, Images } from './globals'

// let canvas = document.getElementById('canvas-id');
// const input = new Input(canvas);

export default function BadGuyTemp (image, state, pos) {
  return new CollisionBodySquare({
    pos,
    width: 70,
    height: 70,
    fillStyle: 'rgba(0, 0, 255, 1)',
    strokeStyle: 'rgb(0, 0, 0)',
    speed: 0.01,
    hide: false,
    rotation: 0,
    collisionObjects: [
      {
        collisionCenter: {x: 0, y: 0},
        collisionDim: {x: 70, y: 70},
      }
    ],
    collisionShow: true,
    image,
    ss: {
      S: [
        {
          x: 0,
          y: 0,
          width: 111,
          height: 106
        },
      ],
      T: [
        {
          x: 0,
          y: 0,
          width: 111,
          height: 95
        },
      ],
      R: [
        {
          x: 0,
          y: 0,
          width: 110,
          height: 171
        },
      ],
    },
    state,
    events: {
      // particles: (...args) => {
      //   thrust.thrust(...args)
      // }
    },
    update: [
      function move (elapsedTime, input) {
        if (this.path) {
          let i = this.pathIndex
          let at = 1 - this.t;
          let green1x = this.path[i].p0.x * this.t + this.path[i].p1.x * at;
          let green1y = this.path[i].p0.y * this.t + this.path[i].p1.y * at;
          let green2x = this.path[i].p1.x * this.t + this.path[i].p2.x * at;
          let green2y = this.path[i].p1.y * this.t + this.path[i].p2.y * at;
          let green3x = this.path[i].p2.x * this.t + this.path[i].p3.x * at;
          let green3y = this.path[i].p2.y * this.t + this.path[i].p3.y * at;
          let blue1x = green1x * this.t + green2x * at;
          let blue1y = green1y * this.t + green2y * at;
          let blue2x = green2x * this.t + green3x * at;
          let blue2y = green2y * this.t + green3y * at;
          let finalx = blue1x * this.t + blue2x * at;
          let finaly = blue1y * this.t + blue2y * at;

          this.rotation = Math.atan2(finaly - this.pos.y, finalx - this.pos.x)
           - (0.5 * Math.PI);

          this.pos.x = finalx
          this.pos.y = finaly

          this.t += this.path[i].speed;
          // if (this.t > 1 || this.t < 0) this.speed *= -1;
          if (this.t > 1) {
            this.t = 0
            if (this.path.length === this.pathIndex + 1) {
              // this.pathIndex = 0
              this.path = null
              this.rotation = 0
            } else {
              this.pathIndex++
            }
          };
        } else {
          this.pos.x = this.originalPos.x + this.holdingOffset.x
          this.pos.y = this.originalPos.y + this.holdingOffset.y
          this.shoot = true
          this.home = true
        }
      },
      function shoot (elapsedTime, input) {
        let rand = Math.random()
        if (this.shoot && (rand > 0.999)) {
          this.events.shoot(this.pos)
        }
      },
      function checkDie (elapsedTime, input) {
        if (this.checkCollision()) {
          if (!this.lives) {
            this.dead = true
            this.events.explosion(this.pos.x, this.pos.y)
            if (this.path) {
              this.events.score(this.score * 2)
            } else {
              this.events.score(this.score)
            }
          } else {
            this.lives = 0
            this.image = Images.novaCpurple4
          }
        }
        if (this.checkGone) {
          if (this.pos.x > 1100 || this.pos.x < -100) {
            this.dead = true
          }
          if (this.pos.y > 1100 || this.pos.y < -100) {
            this.dead = true
          }
        }
      }
    ]
  })
}