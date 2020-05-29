import Vector2 from './vector2'

export default class Line2d {
  constructor (config) {
    this.name = config.name ? config.name : 'random_name';
    this.points = config.points ? config.points : [
      new Vector2(10, 10), new Vector2(400, 400)
    ];
    this.stroke = config.stroke ? config.stroke : 'rgba(162, 162, 162, 1)';
    this.lineWidth = config.lineWidth ? config.lineWidth : 6;
    this.hide = config.hide ? config.hide : false;
    this.fill = config.fill ? config.fill : false;
    let updateFns = [];
    if (config.update) {
      config.update.map(e => {
        updateFns.push(e.bind(this));
      })
    }
    this.updateFns = updateFns;
  }

  update(elapsedTime) {
    this.updateFns.map(e => {
      e(elapsedTime, this.input)
    })
  }

  render(ctx) {
    if (!this.hide) {
      ctx.beginPath();
      for (let i = 0; i < this.points.length; i++) {
        if (i === 0) {
          ctx.moveTo(this.points[i].x, this.points[i].y);
        } else {
          ctx.lineTo(this.points[i].x, this.points[i].y);
        }
      }
      ctx.strokeStyle = this.stroke;
      ctx.lineWidth = this.lineWidth;
      ctx.stroke();
      if(this.fill) {
        ctx.closePath()
        ctx.fill()
      }
    }
  }
}