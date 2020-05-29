export default class Timer {
  constructor(config) {
    this.config = config
    this.time = config.time ? config.time : 10
    this.seconds = 0
    this.paused = true
    this.eventFired = false
    this.event = config.event
  }

  start (time) {
    this.time = time
    this.eventFired = false
    this.paused = false
  }

  reset () {
    this.eventFired = false
    this.time = this.config.time ? this.config.time : 10
  }

  update (elapsedTime) {
    if(!this.paused) {
      this.time -= elapsedTime
      this.seconds = Math.ceil(this.time / 1000)
    }
    if (this.time <= 0) {
      if (!this.eventFired) {
        if (this.event !== undefined) {
          this.event()
        }
        this.eventFired = true
      }
      this.time = Math.abs(0)
    }
  }
}