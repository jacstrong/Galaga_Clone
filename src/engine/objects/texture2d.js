import Object2d from './object2d'
import { randInt } from '../utils/random'

export default class Texture2d extends Object2d {

  constructor(config) {
    super(config)
    this.speed = config.speed ? config.speed : 0;
    this.rotationRate = config.rotationRate ? config.rotationRate : 2 * Math.PI / 10000;
    this.fillStyle = config.fillStyle ? config.fillStyle : 'rgba(0, 0, 255, 1)';
    this.strokeStyle = config.strokeStyle ? config.strokeStyle : 'rgb(0, 0, 0)';
    this.orientation = config.orintation ? config.orientation : 0;
    this.ss = config.ss ? config.ss : {};
    if (config.randomState) {
      this.state = config.state ?
      this.ss[config.state][randInt(this.ss[config.state].length)] : 
      this.ss[Object.keys(this.ss)[0]];
    } else {
      this.state = config.state ?
        this.ss[config.state][0] : 
        this.ss[Object.keys(this.ss)[0]];
    }
    this.currentState = config.state ? config.state : Object.keys(this.ss)[0]
    this.image = config.image ? config.image : undefined;
    this.collisionShow = config.collisionShow ?
      config.collisionShow : false
  }

  setState(state, frame) {
    this.state = this.ss[state][0]
    this.currentState = state
  }

  render (context) {
    context.save();
    context.translate(this.pos.x, this.pos.y);
    context.rotate(this.rotation);
    context.translate(-this.pos.x, -this.pos.y);
    if (!this.hide) {
      context.drawImage(
        this.image, // image
        this.state.x, // Crop top x
        this.state.y, // Crop top y
        this.state.width, // Crop width
        this.state.height, // Crop heigth
        this.pos.x - (this.width / 2), // top left x
        this.pos.y - (this.height / 2), // top left y
        this.width, // Width on canvas
        this.height // Height on canvas
        );

    }
    
    // if (this.collisionObjects !== undefined ) {
    if (false) {
      // if (this.collisionShow) {
      if (this.collisionType === 'square') {
        for (let i = 0; i < this.collisionObjects.length; i++) {
          const el = this.collisionObjects[i];
          
          context.fillStyle = 'rgba(0, 0, 255, 0.3)';
          context.fillRect(
            (el.collisionCenter.x - el.collisionDim.x / 2) + this.pos.x,
            (el.collisionCenter.y - el.collisionDim.y / 2)  + this.pos.y,
            el.collisionDim.x,
            el.collisionDim.y
            );
          }
      } else if (this.collisionType === 'circle') {
        let rad = this.collisionObjects[0].collisionRad
        let colX = this.collisionObjects[0].collisionCenter.x
        let colY = this.collisionObjects[0].collisionCenter.y
        context.fillStyle = 'rgba(0, 0, 255, 0.3)';
        context.beginPath();
        context.arc(this.pos.x + colX, this.pos.y + colY, rad, 0, 2 * Math.PI);
        context.stroke();
      }
    }

    context.restore();
    // context.save();
    // if (this.path) {
    //   for (let i = 0; i < this.path.length; i++) {
    //     let p = this.path[i]
    //     context.beginPath();
    //     context.arc(p.p0.x, p.p0.y, 10, 0, 2 * Math.PI, false);
    //     context.fillStyle = 'green';
    //     context.fill();
    //     context.closePath();

    //     context.beginPath();
    //     context.arc(p.p1.x, p.p1.y, 10, 0, 2 * Math.PI, false);
    //     context.fillStyle = 'yellow';
    //     context.fill();
    //     context.closePath();
        
    //     context.beginPath();
    //     context.arc(p.p2.x, p.p2.y, 10, 0, 2 * Math.PI, false);
    //     context.fillStyle = 'purple';
    //     context.fill();
    //     context.closePath();
        
    //     context.beginPath();
    //     context.arc(p.p3.x, p.p3.y, 10, 0, 2 * Math.PI, false);
    //     context.fillStyle = 'pink';
    //     context.fill();
    //     context.closePath();
        
    //   }
    // }
    // context.restore();
  }
  
}