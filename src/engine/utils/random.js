export const randInt = function(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

export const randIntRange = function (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const randPosNeg = function () {
  if (Math.random() > 0.5) {
    return Math.random();
  } else {
    return Math.random() * -1;
  }
}

export const randRange = function (min, max) {
  let rand = Math.random() * (max - min)
  return min + rand
}

export default {
  randInt,
  randIntRange,
  randPosNeg,
  randRange
}