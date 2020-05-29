import Player2d from './player2d'
import Vector2 from './vector2';

export default class CollisionBodyCircle extends Player2d {
  constructor (config) {
    super(config)
    // this.moveUp = config.update.moveUp.bind(this)
    // this.moveDown = config.update.moveDown.bind(this)
    this.box = config.box ? config.box : undefined;
    this.collisionType = 'circle';
    this.fuel = config.fuel;
    
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
    this.first = true
  }

  checkCollision () {
    this.hasCollided = false
    const pos = this.pos;
    const center = this.collisionObjects[0].collisionCenter;
    const rad = this.collisionObjects[0].collisionRad;

    if (this.first) {
      console.log('yo');
      this.first = false
    }

    let x = pos.x + center.x
    let y = pos.y + center.y

    let collision = false
    // console.log(this.collisionChecks)

    for (let i = 0; i < this.collisionChecks.length; i++) {
      const element = this.collisionChecks[i];
      // for (let j = 0; j < element.length; j++) {
        if (i < this.collisionChecks.length - 1) {
          const el = this.collisionChecks[i]
          const el1 = this.collisionChecks[i + 1]
          let x1 = el.x
          let y1 = el.y
          let x2 = el1.x
          let y2 = el1.y
          if (this.lineCircle(x1, y1, x2, y2, x, y, rad)) {
            this.hasCollided = true
          }
      }
    }

    return this.hasCollided
  }

  // http://www.jeffreythompson.org/collision-detection/line-circle.php
  // 

  lineCircle(x1, y1, x2, y2, cx, cy, r) {
    // console.log('im here')
    let inside1 = this.pointCircle(x1, y1, cx, cy, r);
    let inside2 = this.pointCircle(x2, y2, cx, cy, r);
    if (inside1 || inside2) return true;
  
    // get length of the line
    let distX = x1 - x2;
    let distY = y1 - y2;
    let len = Math.sqrt( (distX*distX) + (distY*distY) );
  
    // get dot product of the line and circle
    let dot = ( ((cx-x1)*(x2-x1)) + ((cy-y1)*(y2-y1)) ) / Math.pow(len,2);
  
    // find the closest point on the line
    let closestX = x1 + (dot * (x2-x1));
    let closestY = y1 + (dot * (y2-y1));
  
    // is this point actually on the line segment?
    // if so keep going, but if not, return false
    let onSegment = this.linePoint(x1, y1, x2, y2, closestX, closestY);
    if (!onSegment) return false;
    // optionally, draw a circle at the closest
    // point on the line
  
    // get distance to closest point
    distX = closestX - cx;
    distY = closestY - cy;
    let distance = Math.sqrt( (distX*distX) + (distY*distY) );
  
    if (distance <= r) {
      return true;
    }
    return false;
  }

  linePoint(x1, y1, x2, y2, px, py) {
    let d1 = this.dist(px,py, x1,y1);
    let d2 = this.dist(px,py, x2,y2);
  
    let lineLen = this.dist(x1,y1, x2,y2);
  
    let buffer = 0.1;
  
    if (d1+d2 >= lineLen-buffer && d1+d2 <= lineLen+buffer) {
      return true;
    }
    return false;
  }

  pointCircle(px, py, cx, cy, r) {
  
    let distX = px - cx;
    let distY = py - cy;
    let distance = Math.sqrt( (distX*distX) + (distY*distY) );
  
    if (distance <= r) {
      return true;
    }
    return false;
  }

  dist (x1, y1, x2, y2) {
    return Math.abs(
      Math.sqrt(
        Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)
      )
    )
  }
}