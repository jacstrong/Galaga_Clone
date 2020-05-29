export default class Stopwatch {
  constructor() {
    this.time = 0
    this.seconds = 0
    this.paused = false
  }

  update (elapsedTime) {
    if(!this.paused) {
      this.time += elapsedTime

      this.seconds = (this.time / 1000).toFixed(2)
    }
  }
}