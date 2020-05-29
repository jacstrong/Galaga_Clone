// Takes a 2d array each is a layer

export default class Render {
  
  constructor (context, canvas, cameras, background, hud) {
    this.context = context
    this.canvas = canvas
    this.cameras = cameras
    this.aciteCamera = 0
    this.background = background ? background : 'rgba(0, 0, 0, 1)'
    this.hud = []
    if (hud) {
      this.hud = hud
    }

    this.backgroundImage = new Image();
    this.backgroundImage.addEventListener('load', function() {
      console.log('background image loaded')
    });
    this.backgroundImage.src = require('../assets/background.png')

  }

  frame (r) {
    // this.canvas.cssText = `width: ${window.innerWidth}; height: ${window.innerWidth}`;
    
    this.canvas.style.background = this.background

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.context.drawImage(
      this.backgroundImage, // image
      420, // Crop top x
      0, // Crop top y
      1080, // Crop width
      1080, // Crop heigth
      0, // top left x
      0, // top left y
      1024, // Width on canvas
      1024
    )

    this.context.save();
    this.context.translate(this.cameras[this.aciteCamera].pos.x,
      this.cameras[this.aciteCamera].pos.y);
    this.context.rotate(this.cameras[this.aciteCamera].rotation)
    this.context.scale(
      this.cameras[this.aciteCamera].scale.x,
      this.cameras[this.aciteCamera].scale.y);
    for (let i = 0; i < r.length; i++) {
      const layer = r[i];
      for (let l = 0; l < layer.length; l++) {
        const object = layer[l];
        if (object) {
          object.render(this.context);
        }
      }
    }
    this.context.restore();
    for (let i = 0; i < this.hud.length; i++) {
      this.hud[i].render(this.context);
    }
  }
  
  loading (progress) {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fillStyle = 'rgba(0, 150, 130, 1)';
    let width = this.canvas.width * progress;
    let height = this.canvas.height * progress;
    let x = (this.canvas.width / 2) - (width / 2);
    let y = (this.canvas.height / 2) - (height / 2);
    this.context.fillRect(x, y, width, height);
  }
}