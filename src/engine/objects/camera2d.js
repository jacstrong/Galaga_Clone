import Vector2 from './vector2';
import Object2d from './object2d';

export default class Camera2d extends Object2d {
  constructor (config) {
    super(config)
    
    this.followDist = config.followDist ?
      new Vector2(config.followDist.x, config.followDist.y) :
      new Vector2(0, 0);
  }

  followObject (object) {
    let follow = function(elapsedTime) {
      // if (Math.abs(object.pos.x - this.pos.x) > this.followDist.x) {
      //   this.pos.x += object.pos.x - this.pos.x;
      // }
      // if (object.pos.y - this.pos.y > this.followDist.y) {
        // this.pos.y -= 1;
      // }
      this.pos.x = -object.getPos().x * this.scale.x + 400
      this.pos.y = -object.getPos().y * this.scale.y + 400
    }

    this.addToUpdate(follow)
  }

}