export const storeGlobals = function ()  {
  localStorage.setItem('globals',
    JSON.stringify(globals)
  )
}

export const getGlobals= function () {
  if (localStorage.getItem('globals')) {
    globals = JSON.parse(localStorage.getItem('globals'))
  } else {
    localStorage.setItem('globals',
      JSON.stringify(globals)
    )
  }
}

export let globals = {
  score: 0,
  up: 'ArrowUp',
  down: 'ArrowDown',
  left: 'ArrowLeft',
  right: 'ArrowRight',
  fire: ' ',
  highScores: []
}

function sound(src, start) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.currentTime = start
    this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
  }
} 

export const sounds = {
  music1: new sound(require('../assets/music/storm.mp3'), 0),
  music2: new sound(require('../assets/music/level-up.mp3'), 0),
  laser: new sound(require('../assets/music/laser-shot.wav'), 0.3),
  explosion: new sound(require('../assets/music/explosion.wav'), 0),
  music3: new sound(require('../assets/music/lost-times.mp3'), 0)
}

const fireImage = new Image();
fireImage.addEventListener('load', function() {
  console.log('fire image loaded')
});
fireImage.src = require('../assets/explosion.png');

const novaAblue1 = new Image();
novaAblue1.src = require('../assets/Spaceships-nova/nova-a-blue-1.png')

const novaAred1 = new Image();
novaAred1.src = require('../assets/Spaceships-nova/nova-a-red-1.png')

const novaCyellow1 = new Image();
novaCyellow1.src = require('../assets/Spaceships-nova/nova-c-yellow-1.png')

const novaApurple4 = new Image();
novaApurple4.src = require('../assets/Spaceships-nova/nova-a-purple-4.png')

const novaBgreen4 = new Image();
novaBgreen4.src = require('../assets/Spaceships-nova/nova-b-green-4.png')

const novaBorange4 = new Image();
novaBorange4.src = require('../assets/Spaceships-nova/nova-b-orange-4.png')

const novaCred3 = new Image();
novaCred3.src = require('../assets/Spaceships-nova/nova-c-red-3.png')

const novaCpurple4 = new Image();
novaCpurple4.src = require('../assets/Spaceships-nova/nova-c-purple-4.png')

export let Images = {
  fireImage,
  novaAblue1,
  novaAred1,
  novaCyellow1,
  novaApurple4,
  novaBgreen4,
  novaBorange4,
  novaCred3,
  novaCpurple4
}