import Texture2d from './texture2d';

export default class Player2d extends Texture2d {
  constructor (config) {
    super(config)
    // this.moveUp = config.update.moveUp.bind(this)
    // this.moveDown = config.update.moveDown.bind(this)
    this.box = config.box ? config.box : undefined;
    
  }

}