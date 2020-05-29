import Vector2 from './vector2';

export default class Object2d {
  constructor (config) {
    this.name = config.name ? config.name : 'random_name';
    this.width = config.width ? config.width : 0;
    this.height = config.height ? config.height : 0;
    this.pos = config.pos ? 
      new Vector2(config.pos.x, config.pos.y) : 
      new Vector2(0, 0);
    this.scale = config.scale ? 
      new Vector2(config.scale.x, config.scale.y) : 
      new Vector2(0, 0);
    this.rotation = config.rotation ? config.rotation : 0;
    this.physicsVector = config.physicsVector ? config.physicsVector : new Vector2(0, 0);
    this.physicsInertia = config.physicsInertia ? config.physicsInertia : new Vector2(0, 0);
    this.hide = config.hide ? config.hide : false;

    this.input = config.input ? config.input : undefined;
    
    this.events = config.events ? config.events : undefined;

    let updateFns = [];
    if (config.update) {
      config.update.map(e => {
        updateFns.push(e.bind(this));
      })
    }
    this.updateFns = updateFns;
  }

  getPos() {
    return this.pos
  }

  addToUpdate(fun) {
    this.updateFns.push(fun.bind(this));
  }

  update(elapsedTime, input) {
    this.updateFns.map(e => {
      e(elapsedTime, input)
    })
  }

  rotate(radians) {
    this.rotation += radians;
  }

  render(context) {

  }
}