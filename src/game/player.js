import CollisionBodySquare from '../engine/objects/collisionBodySquare';

import { globals, Images } from './globals'

// let canvas = document.getElementById('canvas-id');
// const input = new Input(canvas);

const ss = new Image(); 
ss.addEventListener('load', function() {
  // console.log('space ship image loaded')
});
ss.src = require('../assets/space-ship.gif');

let player = new CollisionBodySquare({
  pos: {x: 512, y: 900},
  width: 70,
  height: 70,
  fillStyle: 'rgba(0, 0, 255, 1)',
  strokeStyle: 'rgb(0, 0, 0)',
  speed: 0.3,
  hide: false,
  rotation: 1 * Math.PI,
  collisionObjects: [
    {
      collisionCenter: {x: 0, y: 0},
      collisionDim: {x: 70, y: 70},
    }
  ],
  collisionShow: true,
  image: Images.novaCyellow1,
  ss: {
    S: [
      {
        x: 0,
        y: 0,
        width: 106,
        height: 111
      },
    ],
  },
  state: 'S',
  events: {
    // particles: (...args) => {
    //   thrust.thrust(...args)
    // }
  },
  update: [
    function moveLeft (elapsedTime, input) {
      if (input.keys.hasOwnProperty(globals.left)) {
        if (this.pos.x > 128) {
          this.pos.x -= this.speed * elapsedTime
        }
      }
    },
    function moveRight (elapsedTime, input) {
      if (input.keys.hasOwnProperty(globals.right)) {
        if (this.pos.x < 896) {
          this.pos.x += this.speed * elapsedTime
        }
      }
    },
    function checkDie (elapsedTime, input) {
      if (this.checkCollision()) {
        if (!this.dead) {
          this.events.playerDie(this.pos.x, this.pos.y)
        }
      }
    }
  ]
})

export default player;