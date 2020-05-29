import CollisionBodySquare from '../engine/objects/collisionBodySquare'

const fireImage = new Image();
fireImage.addEventListener('load', function() {
  console.log('fire image loaded')
});
fireImage.src = require('../assets/explosion.png');

export default function (pos) {
  return new CollisionBodySquare({
    pos,
    width: 15,
    height: 15,
    fillStyle: 'rgba(0, 0, 255, 1)',
    strokeStyle: 'rgb(0, 0, 0)',
    speed: 0.9,
    hide: false,
    collisionObjects: [
      {
        collisionCenter: {x: 0, y: 0},
        collisionDim: {x: 15, y: 15},
      }
    ],
    collisionShow: true,
    image: fireImage,
    ss: {
      S: [
        {
          x: 775,
          y: 775,
          width: 450,
          height: 450
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
      function kill (elapsedTime, input) {
        this.pos.y -= this.speed * elapsedTime
        this.time -= elapsedTime
      },
      function collision (elapsedTime, input) {
        if (this.checkCollision()) {
          this.dead = true
        }
      }
    ]
  });
}