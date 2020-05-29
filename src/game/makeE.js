import CollisionBody from '../engine/objects/collisionBody'

const spriteWidth = 32;

export default function makeE (x, y, ss) {
  return new CollisionBody({
  image: ss,
  pos: { x: x, y: y },
  width: spriteWidth / 4,
  height: spriteWidth,
  rotation: 0,
  callback: () => {
    console.log('image loaded')
  },
  collisionObjects: [
    {
      collisionCenter: { x: 4, y: 16},
      collisionDim: { x: 8, y: 32},
    }
  ],
  randomState: true,
  ss: {
    E: [
      {
        x: 0,
        y: 112,
        width: 4,
        height: 16
      },
      {
        x: 0,
        y: 128,
        width: 4,
        height: 16
      },
    ],
  },
  state: 'E'
  });
}