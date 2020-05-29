import Object2d from './object2d';
import Random, { ranPosNeg, randPosNeg } from '../utils/random'

export default class Particle {
  constructor (config) {

    this.particles = [];
    this.events = [];

    this.image = config.image ? config.image : undefined;
    this.state = config.state ? config.state : undefined;

    let updateFns = [];
    if (config.update) {
      config.update.map(e => {
        updateFns.push(e.bind(this));
      })
    }
    this.updateFns = updateFns;
  }
  
  updateParticles (elapsedTime) {
    let newParts = []
    for (let i = 0; i < this.particles.length; i++) {
      const el = this.particles[i];
      el.x = el.x + el.xVel * elapsedTime * el.speed
      el.y = el.y + el.yVel * elapsedTime * el.speed
      el.rotation += el.rotationRate * elapsedTime
      el.duration -= elapsedTime
      if (el.duration > 0) {
        newParts.push(el)
      }
    }
    this.particles = newParts
  }

  update(elapsedTime, input) {
    this.updateParticles(elapsedTime)
    this.updateFns.map(e => {
      e(elapsedTime, input)
    })
  }

  explosion (x, y, inertia) {
    for (let i = 0; i < 60; i++) {
      let theta = Math.random() * 2 * Math.PI;
      let speed = randPosNeg() * 0.5
      this.particles.push({
        x: x,
        y: y,
        width: 20,
        height: 20,
        rotationRate: randPosNeg() * 0.1,
        rotation: 0,
        speed: speed,
        xVel: Math.cos(theta),
        yVel: Math.sin(theta),
        duration: Math.random() * 500
      })
    } 
  }

  edges (x1, x2, y2) {

    // bottom
    for (let i = 0; i < 50; i++) {
      let speed = Math.random() * 0.05
      this.particles.push({
        x: Random.randRange(x1, x2),
        y: y2,
        width: 20,
        height: 20,
        rotationRate: Random.randPosNeg() * 0.1,
        rotation: 0,
        speed: speed,
        xVel: 0,
        yVel: 1,
        duration: Math.random() * 2000
      })
    }
  }

  thrust (x, y, rot) {
    for (let i = 0; i < 10; i++) {
      let theta = Math.random() * 2 * Math.PI;
      let speed = Math.random() * 0.5
      let xVel = Math.sin(-rot + randPosNeg() * 0.1)
      let yVel = Math.cos(rot + randPosNeg() * 0.1)
      let xOff = Math.sin(-rot)
      let yOff = Math.cos(rot)
      // let speed = randPosNeg() * 0.2
      this.particles.push({
        x: x + xOff * 40,
        y: y + yOff * 40,
        width: 10,
        height: 10,
        rotationRate: randPosNeg() * 0.1,
        rotation: 0,
        speed: speed,
        xVel: xVel,
        yVel: yVel,
        duration: Math.random() * 500
      })
    } 
  }

  render (context) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const part = this.particles[i];
      context.save();
      context.translate(part.x, part.y);
      context.rotate(part.rotation);
      context.translate(-part.x, -part.y);

      context.drawImage(
        this.image, // image
        this.state.x, // Crop top x
        this.state.y, // Crop top y
        this.state.width, // Crop width
        this.state.height, // Crop heigth
        part.x - (part.width / 2), // top left x
        part.y - (part.height / 2), // top left y
        part.width, // Width on canvas
        part.height // Height on canvas
        );

      context.restore();
    }

  }
}