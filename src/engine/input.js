export default class Input {
  constructor(canvas) {
    this.keys = []
    this.keyPress = []
    this.mouseLocation = {x: 0, y: 0}
    this.mouseClick
    
    window.addEventListener('keydown', (e) => {
      this.keys[e.key] = e.timeStamp;
      this.keyPress[e.key] = e.timeStamp;
    });
    window.addEventListener('keyup', (e) => {
      delete this.keys[e.key];
    });

    canvas.addEventListener('mousedown', (e) => {
      this.mouseClick = true
    });
    // canvas.addEventListener('mouseup', mouseUp);
    canvas.addEventListener('mousemove', (e) => {
      this.mouseLocation.x = (e.clientX - canvas.offsetLeft) * (canvas.width / canvas.offsetWidth)
      this.mouseLocation.y = (e.clientY - canvas.offsetTop) * (canvas.height / canvas.offsetHeight)
      // this.mouseLocation = e
    });
  }

  clear() {
    this.keyPress = []
    this.mouseClick = false
  }
}

