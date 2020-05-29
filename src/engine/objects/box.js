
export default class Box {

  constructor(config) {
    this.left = config.left ? config.left : 0;
    this.top = config.top ? config.top : 0;
    this.width = config.width ? config.width : 0;
    this.height = config.height ? config.height : 0;
    this.speed = config.speed ? config.speed : 0;
    this.rotationRate = config.rotationRate ? config.rotationRate : 2 * Math.PI / 10000;
    this.fillStyle = config.fillStyle ? config.fillStyle : 'rgba(0, 0, 255, 1)';
    this.strokeStyle = config.strokeStyle ? config.strokeStyle : 'rgb(0, 0, 0)';
    this.orientation = config.orintation ? config.orientation : 0;
    this.center = {
      x: this.left + this.width / 2,
      y: this.top + this.height / 2
    }
  }

  render (context) {
    context.save();
    context.translate(this.center.x, this.center.y);
    context.rotate(this.orientation);
    context.translate(-this.center.x, -this.center.y);
  
    context.fillStyle = this.fillStyle;
    context.fillRect(this.center.x - this.width / 2, this.center.y - this.height / 2, this.width, this.height);
    
    context.strokeStyle = this.strokeStyle;
    context.strokeRect(this.center.x - this.width / 2, this.center.y - this.height / 2, this.width, this.height);
  
    context.restore();
  }
  
}