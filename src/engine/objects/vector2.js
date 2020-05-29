export default class Vector2 {
  constructor (x, y) {
    this.x = x;
    this.y = y;
  }

  add(vector) {
    this.x += vector.x
    this.y += vector.y
  }

  // get y() {
  //   return x
  // }
}