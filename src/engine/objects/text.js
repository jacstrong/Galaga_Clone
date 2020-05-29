import Object2d from './object2d'

export default class Text extends Object2d {

  constructor(config) {
    super(config)
    this.font = config.font ? config.font : '12px Arial';
    this.text = config.text ? config.text : 'text';
    this.fillStyle = config.fillStyle ? config.fillStyle : 'gray';
    this.textAlign = config.textAlign ? config.textAlign : 'left';
    this.hide = config.hide ? config.hide : false;
  }
  
  render (context) {
    if (!this.hide) {
      context.save();
      context.translate(this.pos.x, this.pos.y);
      context.rotate(this.rotation);
      context.translate(-this.pos.x, -this.pos.y);
      context.fillStyle = this.fillStyle
      context.font = this.font
      context.fillText(this.text, this.pos.x, this.pos.y); 
      context.restore();
    }
  }
}