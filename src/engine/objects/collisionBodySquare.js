import Player2d from './player2d'
import Vector2 from './vector2';

export default class CollisionBodySquare extends Player2d {
  constructor (config) {
    super(config)
    // this.moveUp = config.update.moveUp.bind(this)
    // this.moveDown = config.update.moveDown.bind(this)
    this.box = config.box ? config.box : undefined;
    this.collisionType = 'square'
    

    this.collisionObjects = [...config.collisionObjects]

    // this.collisionCenter = new Vector2(
    //   config.collisionCenter.x ? config.collisionCenter.x : 0,
    //   config.collisionCenter.y ? config.collisionCenter.y : 0
    // )
    // this.collisionDim = new Vector2(
    //   config.collisionDim.x ? config.collisionDim.x : 0,
    //   config.collisionDim.y ? config.collisionDim.y : 0
    // )
    this.collisionChecks = []
    this.hasCollided = false
    
    if (config.collisionChecks) {
      this.collisionChecks = [...config.collisionChecks]
    }
    this.hasBeenVisited = false
  }

  checkCollision () {
    this.hasCollided = false
    const pos = this.pos;
    const center = this.collisionObjects[0].collisionCenter;
    const dim = this.collisionObjects[0].collisionDim;

    let x = pos.x + center.x
    let y = pos.y + center.y

    let xdim = dim.x / 2
    let ydim = dim.y / 2

    let collision = false

    for (let i = 0; i < this.collisionChecks.length; i++) {
      const element = this.collisionChecks[i];
      for (let j = 0; j < element.collisionObjects.length; j++) {
        const el = element.collisionObjects[j];

        let obX = el.collisionCenter.x + element.pos.x
        let obY = el.collisionCenter.y + element.pos.y

        let obXdim = el.collisionDim.x / 2
        let obYdim = el.collisionDim.y / 2

        if (x + xdim > obX - obXdim
          && y + ydim > obY - obYdim
          && x - xdim < obX + obXdim
          && y - ydim < obY + obYdim) {
            collision = true
        }
        
      }
    }

    return collision
  }

}