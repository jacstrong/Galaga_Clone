import Random, { randPosNeg } from '../engine/utils/random';
import Vector2 from '../engine/objects/vector2';

export default function generateLevel(platforms) {
  if (platforms === 2) {
    let points = [new Vector2(0, Random.randIntRange(600, 950))]
    let x = Random.randIntRange(100, 800);
    let y = Random.randIntRange(600, 950);
    points.push(new Vector2(x, y))
    for (let i = 0; i < 50; i++) {
      let y2 = 0
      let r = 0

      while (y2 > 960 || y2 < 300) {
        r = 2 * randPosNeg() * Math.abs(points[i + 1].x - points[i].x)
        y2 = 0.5 * (points[i].y + points[i + 1].y) + r
      }
      let x = points[i].x + (0.5 * (points[i + 1].x - points[i].x))
      // let x = points[i].x + 100
      points.splice(i + 1, 0, new Vector2(x, y2))
    }
    points.push(new Vector2(x + 75, y))
    points.push(new Vector2(1024, Random.randIntRange(600, 950)))

    for (let i = 0; i < 50; i++) {
      let offset = 52
      let y2 = 0
      let r = 0

      while (y2 > 960 || y2 < 300) {
        r = 2 * randPosNeg() * Math.abs(points[i + 1 + offset].x - points[i + offset].x)
        y2 = 0.5 * (points[i + offset].y + points[i + 1 + offset].y) + r
      }
      let x = points[i + offset].x + (0.5 * (points[i + 1 + offset].x - points[i + offset].x))
      // let x = points[i].x + 100
      points.splice(i + 1 + offset, 0, new Vector2(x, y2))
    }
    points.splice(0, 0, new Vector2(0, 1024))
    points.push(new Vector2(1024, 1024))
    return {
      points,
      landing: [{x: x, y: y}, {x: x + 75, y: y}]
    }
  } 
  ///////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////
  else if (platforms === 1) {
    let bigger = (Math.random() > 0.5) ? true : false;
    let points = [new Vector2(0, Random.randIntRange(600, 950))]
    let platx1 = Random.randIntRange(50, 450);
    let platy1 = Random.randIntRange(600, 950);
    let platx2 = Random.randIntRange(550, 900);
    let platy2 = Random.randIntRange(600, 950);
    points.push(new Vector2(platx1, platy1))
    
    for (let i = 0; i < 50; i++) {
      let y2 = 0
      let r = 0
      while (y2 > 960 || y2 < 300) {
        r = 2 * randPosNeg() * Math.abs(points[i + 1].x - points[i].x)
        y2 = 0.5 * (points[i].y + points[i + 1].y) + r
      }
      let x = points[i].x + (0.5 * (points[i + 1].x - points[i].x))
      // let x = points[i].x + 100
      points.splice(i + 1, 0, new Vector2(x, y2))
    }
    points.push(new Vector2(platx1 + (bigger ? 75 : 100), platy1))
    points.push(new Vector2(platx2, platy2))

    for (let i = 0; i < 50; i++) {
      let offset = 52
      let y2 = 0
      let r = 0
      while (y2 > 960 || y2 < 300) {
        r = 2 * randPosNeg() * Math.abs(points[i + 1 + offset].x - points[i + offset].x)
        y2 = 0.5 * (points[i + offset].y + points[i + 1 + offset].y) + r
      }
      let x = points[i + offset].x + (0.5 * (points[i + 1 + offset].x - points[i + offset].x))
      // let x = points[i].x + 100
      points.splice(i + 1 + offset, 0, new Vector2(x, y2))
    }
    points.push(new Vector2(platx2 + (bigger ? 100 : 75), platy2))
    points.push(new Vector2(1024, Random.randIntRange(600, 950)))

    for (let i = 0; i < 50; i++) {
      let offset = 104
      let y2 = 0
      let r = 0

      while (y2 > 960 || y2 < 300) {
        r = 2 * randPosNeg() * Math.abs(points[i + 1 + offset].x - points[i + offset].x)
        y2 = 0.5 * (points[i + offset].y + points[i + 1 + offset].y) + r
      }
      let x = points[i + offset].x + (0.5 * (points[i + 1 + offset].x - points[i + offset].x))
      // let x = points[i].x + 100
      points.splice(i + 1 + offset, 0, new Vector2(x, y2))
    }

    points.splice(0, 0, new Vector2(0, 1024))
    points.push(new Vector2(1024, 1024))
    let landing = []
    if (bigger) {
      landing.push([
        new Vector2(platx1, platy1),
        new Vector2(platx1 + 75, platy1),
      ])
      landing.push([
        new Vector2(platx2, platy2),
        new Vector2(platx2 + 100, platy2),
      ])
    } else {
      landing.push([
        new Vector2(platx1, platy1),
        new Vector2(platx1 + 100, platy1),
      ])
      landing.push([
        new Vector2(platx2, platy2),
        new Vector2(platx2 + 75, platy2),
      ])
      
    }

    return {
      points,
      landing: landing,
      bigger: bigger,
    }
  }
}