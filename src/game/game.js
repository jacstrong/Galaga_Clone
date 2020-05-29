import Render from '../engine/render'
import Camera2d from '../engine/objects/camera2d'
import Input from '../engine/input'
import Text from '../engine/objects/text'
import Random, { randPosNeg } from '../engine/utils/random'
import Stopwatch from '../engine/objects/stopwatch'
// import CollisionBodyCircle from '../engine/objects/collisionBodyCircle'
import CollisionBodySquare from '../engine/objects/collisionBodySquare'

// import Player from './player'
import Line2d from '../engine/objects/line2d'
import Vector2 from '../engine/objects/vector2'

import GenerateLevel from './generateLevel'
import Menu from './menu'
import Timer from '../engine/objects/timer'
import Particle from '../engine/objects/particle'

import { Images, sounds, globals, storeGlobals, getGlobals } from './globals'

import Player from './player'
import Shot from './shotTemp'
import BadGuyTemp from './badGuyTemp'
import player from './player'

export default function game() {
  let canvas = document.getElementById('canvas-id');
  let context = canvas.getContext('2d');

  let previousTime = performance.now();
  
  context.imageSmoothingEnabled = false;

  getGlobals()

  let input = new Input(canvas);

  let cam1 = new Camera2d({
    scale: {
      // x: 0.495,
      // y: 0.495
      x: 1,
      y: 1
    },
    pos: {
      x: 0,
      y: 0,
    },
    rotation: 0,
    input: input,
    followDist: {x: 1, y: 1},
    update: []
  });

  const stopwatch = new Stopwatch()

  let render = new Render(context, canvas, [cam1], 'rgba(154, 206, 235, 1)');


  const fireImage = new Image();
  fireImage.addEventListener('load', function() {
    console.log('fire image loaded')
  });
  fireImage.src = require('../assets/explosion.png');

  const explosion = new Particle ({
    image: fireImage,
    state: {
      x: 775,
      y: 775,
      width: 450,
      height: 450
    },
  })

  const thrust = new Particle ({
    image: fireImage,
    state: {
      x: 775,
      y: 775,
      width: 450,
      height: 450
    },
  })

  let gameState = 1;
  let stateChange = true;
  let levelState = 1;
  let level = 1
  let winChecked = false;
  let end = false;
  let score = 0
  let lives = 2
  let lockPlayer = false
  let playerShots = []
  let shotInterval = 600
  let lastShot = 0
  let shotsFired = 0
  let numHits = 0
  let badGuyShots = []
  let badGuys = []
  let livesSprites = []
  let holdingOffset = {x: 0, y: 0}
  let holdingOffsetDirection = 0

  function setLiveSprites() {
    livesSprites = []
    for (let i = 0; i < lives; i++) {
      livesSprites.push(new CollisionBodySquare({
        pos: {x: 40 * i + 30, y: 980},
        width: 30,
        height: 30,
        hide: false,
        rotation: 1 * Math.PI,
        collisionObjects: [
          // {
          //   collisionCenter: {x: 0, y: 0},
          //   collisionDim: {x: 70, y: 70},
          // }
        ],
        collisionShow: true,
        image: Images.novaCyellow1,
        ss: {
          S: [
            {
              x: 0,
              y: 0,
              width: 106,
              height: 111
            },
          ],
        },
        state: 'S',
      }))
    }
  }
  setLiveSprites()

  function playerShoot() {
    sounds.laser.play()
    playerShots.push(Shot(Player.pos))
    playerShots[playerShots.length - 1].time = 3000
    shotsFired++
  }

  function badGuyShoot(pos) {
    badGuyShots.push(Shot(pos))
    badGuyShots[badGuyShots.length - 1].speed = -0.5
    badGuyShots[badGuyShots.length - 1].time = 3000
  }

  let countdownWait = true

  let countdown = new Timer({
    time: 3000,
    event: function () {
      
    }
  })

  let startLevelTimer = new Timer({
    time: 3000,
    event: function () {
      
    }
  })

  let playerTimer = new Timer({
    time: 3000,
    event: function () {
      
    }
  })

  const exitTimer = new Timer({
    time: 3000,
    event: function () {
      console.log('timer done')
      gameState = 1;
      menu.reset()
    }
  })

  let stageText = new Text({
    text: 'Stage 1',
    font: '50px spaceAge',
    fillStyle: 'white',
    pos: {x: 100, y: 500},
    hide: true,
  })

  let scoreText = new Text({
    text: 'Score: 0',
    font: '30px spaceAge',
    fillStyle: 'white',
    pos: {x: 70, y: 30},
    hide: false,
  })

  let endGameText1 = new Text({
    text: 'Shots Fired: 100',
    font: '30px spaceAge',
    fillStyle: 'white',
    pos: {x: 300, y: 600},
    hide: true
  })

  let endGameText2 = new Text({
    text: 'Number of Hits: 100',
    font: '30px spaceAge',
    fillStyle: 'white',
    pos: {x: 300, y: 650},
    hide: true
  })

  let endGameText3 = new Text({
    text: 'Ratio hit/miss: 100',
    font: '30px spaceAge',
    fillStyle: 'white',
    pos: {x: 300, y: 700},
    hide: true
  })

  let allHome = false
  let addL1P1 = false
  let addL1P2 = false
  let addL1P3 = false
  let addL1P4 = false
  let addL1P5 = false
  let checkLevelOver = false
  let numAdded = 0
  let goalToAdd = 10
  let addTime = 0
  let addInt = 500
  let row = 0
  let col = 0
  let xOff = 100
  let yOff = 200

  function addL1P1Ships(elapsedTime) {
    addTime += elapsedTime
    if (addTime > addInt) {
      addTime -= addInt
      badGuys.push(BadGuyTemp(Images.novaAblue1, 'S', {x: xOff + col * 90, y: yOff + 0 * 100}))
      badGuys[badGuys.length - 1].events.explosion = function (x, y) {
        explosion.explosion(x, y)
        sounds.explosion.play()
      }
      badGuys[badGuys.length - 1].events.score = function (reportedScore) {
        score += reportedScore
      }
      badGuys[badGuys.length - 1].events.shoot = function (pos) {
        badGuyShoot(pos)
      }
      badGuys[badGuys.length - 1].path = [
        {
          p0: {"x": 300, "y": 550}, // end
          p1: {"x": 600, "y": 400},
          p2: {"x": 500, "y": 500},
          p3: {"x": 600, "y": -50}, // start
          speed: 0.01
        },
        {
          p0: {"x": 512, "y": 512},
          p1: {"x": 800, "y": 800},
          p2: {"x": 50, "y": 750},
          p3: {"x": 300, "y": 550},
          speed: 0.01
        },
        {
          p0: {"x": xOff + col * 90, "y": yOff + 0 * 100},
          p1: {"x": 512, "y": 200},
          p2: {"x": 200, "y": 250},
          p3: {"x": 512, "y": 512},
          speed: 0.01
        },
      ]
      badGuys[badGuys.length - 1].t = 0
      badGuys[badGuys.length - 1].score = 50
      badGuys[badGuys.length - 1].pathIndex = 0
      badGuys[badGuys.length - 1].holdingOffset = {x: 0, y: 0}
      badGuys[badGuys.length - 1].originalPos = {x: xOff + col * 90, y: yOff + 0 * 100}
      if (level === 3) {
        badGuys[badGuys.length - 1].path[2] = {
          p0: {"x": -200, "y": 300},
          p1: {"x": 512, "y": 200},
          p2: {"x": 200, "y": 250},
          p3: {"x": 512, "y": 512},
          speed: 0.01
        }
        badGuys[badGuys.length - 1].checkGone = true
        
      }


      badGuys.push(BadGuyTemp(Images.novaAred1, 'S', {x: xOff + col * 90, y: yOff + 1 * 100}))
      badGuys[badGuys.length - 1].events.explosion = function (x, y) {
        explosion.explosion(x, y)
        sounds.explosion.play()
      }
      badGuys[badGuys.length - 1].events.score = function (reportedScore) {
        score += reportedScore
      }
      badGuys[badGuys.length - 1].events.shoot = function (pos) {
        badGuyShoot(pos)
      }
      badGuys[badGuys.length - 1].path = [
        {
          p0: {"x": 724, "y": 550}, // end
          p1: {"x": 424, "y": 400},
          p2: {"x": 524, "y": 500},
          p3: {"x": 424, "y": -50}, // start
          speed: 0.01
        },
        {
          p0: {"x": 512, "y": 512},
          p1: {"x": 225, "y": 800},
          p2: {"x": 974, "y": 750},
          p3: {"x": 724, "y": 550},
          speed: 0.01
        },
        {
          p0: {"x": xOff + col * 90, "y": yOff + 1 * 100},
          p1: {"x": 512, "y": 200},
          p2: {"x": 824, "y": 250},
          p3: {"x": 512, "y": 512},
          speed: 0.01
        },
      ]
      badGuys[badGuys.length - 1].t = 0
      badGuys[badGuys.length - 1].score = 50
      badGuys[badGuys.length - 1].pathIndex = 0
      badGuys[badGuys.length - 1].holdingOffset = {x: 0, y: 0}
      badGuys[badGuys.length - 1].originalPos = {x: xOff + col * 90, y: yOff + 1 * 100}
      badGuys[badGuys.length - 1].events.shoot = function (pos) {
        badGuyShoot(pos)
      }

      if (level === 3) {
        badGuys[badGuys.length - 1].path[2] = {
          p0: {"x": 1200, "y": 300},
          p1: {"x": 512, "y": 200},
          p2: {"x": 824, "y": 250},
          p3: {"x": 512, "y": 512},
          speed: 0.01
        }
        badGuys[badGuys.length - 1].checkGone = true
        
      }
      
      col++
      if (col > 9) {
        col = 0
        row++
      }
      numAdded += 1
      if (numAdded >= goalToAdd) {
        addL1P1 = false
        levelState = 2
        countdown.event = function () {
          if (level === 1) {
            addL1P2 = true
            numAdded = 0
            goalToAdd = 5
          } else if (level === 2) {
            checkLevelOver = true
          } else if (level === 3) {
            goalToAdd = 5
            numAdded = 0
            levelState = 5
            addL1P5 = true
          }
        }
        countdown.start(5000)
      }
    }
  }

  function addL1P2Ships (elapsedTime) {
    addTime += elapsedTime
    if (addTime > addInt) {
      addTime -= addInt
      badGuys.push(BadGuyTemp(Images.novaBgreen4, 'T', {x: xOff + col * 90, y: 100 + 0 * 100}))
      badGuys[badGuys.length - 1].events.explosion = function (x, y) {
        explosion.explosion(x, y)
        sounds.explosion.play()
      }
      badGuys[badGuys.length - 1].events.score = function (reportedScore) {
        score += reportedScore
      }
      badGuys[badGuys.length - 1].path = [
        {
          p0: {"x": 300, "y": 500}, // end
          p1: {"x": 0, "y": 1200},
          p2: {"x": 800, "y": 500},
          p3: {"x": -50, "y": 900}, // start
          speed: 0.01
        },
        {
          p0:  {x: xOff + col * 90, y: 100 + 0 * 100},
          p1: {"x": 512, "y": 200},
          p2: {"x": 824, "y": 250},
          p3: {"x": 300, "y": 500},
          speed: 0.01
        }
      ]
      badGuys[badGuys.length - 1].t = 0
      badGuys[badGuys.length - 1].score = 150
      badGuys[badGuys.length - 1].pathIndex = 0
      badGuys[badGuys.length - 1].holdingOffset = {x: 0, y: 0}
      badGuys[badGuys.length - 1].originalPos = {x: xOff + col * 90, y: 100 + 0 * 100}
      badGuys[badGuys.length - 1].lives = 1
      badGuys[badGuys.length - 1].events.shoot = function (pos) {
        badGuyShoot(pos)
      }

      if (level === 3) {
        badGuys[badGuys.length - 1].checkGone = true
        badGuys[badGuys.length - 1].path[1] = {
          p0:  {x: 1024, y: -200},
          p1: {"x": 512, "y": 200},
          p2: {"x": 824, "y": 250},
          p3: {"x": 300, "y": 500},
          speed: 0.01
        }

      }

      col++
      if (col > 9) {
        col = 0
        row++
      }
      numAdded += 1
      if (numAdded >= goalToAdd) {
        addL1P2 = false
        levelState = 3
        countdown.event = function () {
          if (level === 1) {
            addL1P3 = true
            numAdded = 0
            goalToAdd = 5
          } else if (level === 2){
            addL1P5 = true
            levelState = 5
            goalToAdd = 5
            numAdded = 0
            col = 0
          } else if (level === 3) {
            checkLevelOver = true
          }
        }
        countdown.start(5000)
      }
    }
  }

  function addL1P3Ships (elapsedTime) {
    addTime += elapsedTime
    if (addTime > addInt) {
      addTime -= addInt
      badGuys.push(BadGuyTemp(Images.novaBorange4, 'T', {x: xOff + col * 90, y: 100 + 0 * 100}))
      badGuys[badGuys.length - 1].events.explosion = function (x, y) {
        explosion.explosion(x, y)
        sounds.explosion.play()
      }
      badGuys[badGuys.length - 1].events.score = function (reportedScore) {
        score += reportedScore
      }
      badGuys[badGuys.length - 1].path = [
        {
          p0: {"x": 724, "y": 500}, // end
          p1: {"x": 1024, "y": 1200},
          p2: {"x": 224, "y": 500},
          p3: {"x": 1074, "y": 900}, // start
          speed: 0.01
        },
        {
          p0:  {x: xOff + col * 90, y: 100 + 0 * 100},
          p1: {"x": 512, "y": 200},
          p2: {"x": 200, "y": 250},
          p3: {"x": 724, "y": 500},
          speed: 0.01
        }
      ]
      badGuys[badGuys.length - 1].t = 0
      badGuys[badGuys.length - 1].score = 150
      badGuys[badGuys.length - 1].pathIndex = 0
      badGuys[badGuys.length - 1].holdingOffset = {x: 0, y: 0}
      badGuys[badGuys.length - 1].originalPos = {x: xOff + col * 90, y: 100 + 0 * 100}
      badGuys[badGuys.length - 1].lives = 1
      badGuys[badGuys.length - 1].events.shoot = function (pos) {
        badGuyShoot(pos)
      }

      if (level === 3) {
        badGuys[badGuys.length - 1].checkGone = true
        badGuys[badGuys.length - 1].path[1] = {
          p0:  {x: 0, y: -200},
          p1: {"x": 512, "y": 200},
          p2: {"x": 200, "y": 250},
          p3: {"x": 724, "y": 500},
          speed: 0.01
        }
      }

      col++
      if (col > 9) {
        col = 0
        row++
      }
      numAdded += 1
      if (numAdded >= goalToAdd) {
        addL1P3 = false
        levelState = 4
        countdown.event = function () {
          if (level === 1) {
            addL1P4 = true
            numAdded = 0
            goalToAdd = 5
            col = 0
          } else if (level === 2 || level === 3) {
            addL1P2 = true
            levelState = 2
            goalToAdd = 5
            numAdded = 0
          }
        }
        countdown.start(4000)
      }
    }
  }

  function addL1P4Ships (elapsedTime) {
    addTime += elapsedTime
    if (addTime > addInt) {
      addTime -= addInt
      badGuys.push(BadGuyTemp(Images.novaCred3, 'R', {x: xOff + 5 + col * 90, y: 400 + 0 * 100}))
      badGuys[badGuys.length - 1].width = 50
      badGuys[badGuys.length - 1].collisionObjects[0].collisionDim.x = 50
      badGuys[badGuys.length - 1].events.explosion = function (x, y) {
        explosion.explosion(x, y)
        sounds.explosion.play()
      }
      badGuys[badGuys.length - 1].events.score = function (reportedScore) {
        score += reportedScore
      }
      badGuys[badGuys.length - 1].path = [
        {
          p0: {"x": 300, "y": 750}, // end
          p1: {"x": 600, "y": 400},
          p2: {"x": 512, "y": 500},
          p3: {"x": 600, "y": -50}, // start
          speed: 0.01
        },
        {
          p0: {x: xOff + 5 + col * 90, y: 400 + 0 * 100},
          p1: {"x": 512, "y": 200},
          p2: {"x": -100, "y": 850},
          p3: {"x": 300, "y": 750},
          speed: 0.01
        },
      ]
      badGuys[badGuys.length - 1].t = 0
      badGuys[badGuys.length - 1].score = 80
      badGuys[badGuys.length - 1].pathIndex = 0
      badGuys[badGuys.length - 1].holdingOffset = {x: 0, y: 0}
      badGuys[badGuys.length - 1].originalPos = {x: xOff + 5 + col * 90, y: 400 + 0 * 100}
      badGuys[badGuys.length - 1].events.shoot = function (pos) {
        badGuyShoot(pos)
      }
      
      if (level === 3) {
        badGuys[badGuys.length - 1].checkGone = true
        badGuys[badGuys.length - 1].path[1] = {
          p0: {x: 200, y: -200},
          p1: {"x": 512, "y": 200},
          p2: {"x": -100, "y": 850},
          p3: {"x": 300, "y": 750},
          speed: 0.01
        }
      }

      col++
      if (col > 9) {
        col = 0
        row++
      }
      numAdded += 1
      if (numAdded >= goalToAdd) {
        addL1P4 = false
        levelState = 5
        countdown.event = function () {
          if (level === 1) {
            addL1P5 = true
            numAdded = 0
            goalToAdd = 5
          } else if (level === 2){
            levelState = 1
            addL1P1 = true
            goalToAdd = 10
            numAdded = 0
          } else if (level === 3) {
            levelState = 3
            addL1P3 = true
            goalToAdd = 5
            numAdded = 0
          }
        }
        countdown.start(5000)
      }
    }
  }

  function addL1P5Ships (elapsedTime) {
    addTime += elapsedTime
    if (addTime > addInt) {
      addTime -= addInt
      badGuys.push(BadGuyTemp(Images.novaCred3, 'R', {x: xOff + 5 + col * 90, y: 400 + 0 * 100}))
      badGuys[badGuys.length - 1].width = 50
      badGuys[badGuys.length - 1].collisionObjects[0].collisionDim.x = 50
      badGuys[badGuys.length - 1].events.explosion = function (x, y) {
        explosion.explosion(x, y)
        sounds.explosion.play()
      }
      badGuys[badGuys.length - 1].events.score = function (reportedScore) {
        score += reportedScore
      }
      badGuys[badGuys.length - 1].path = [
        {
          p0: {"x": 724, "y": 750}, // end
          p1: {"x": 424, "y": 400},
          p2: {"x": 512, "y": 500},
          p3: {"x": 424, "y": -50}, // start
          speed: 0.01
        },
        {
          p0: {x: xOff + 5 + col * 90, y: 400 + 0 * 100},
          p1: {"x": 512, "y": 200},
          p2: {"x": 1124, "y": 850},
          p3: {"x": 724, "y": 750},
          speed: 0.01
        },
      ]
      badGuys[badGuys.length - 1].t = 0
      badGuys[badGuys.length - 1].score = 80
      badGuys[badGuys.length - 1].pathIndex = 0
      badGuys[badGuys.length - 1].holdingOffset = {x: 0, y: 0}
      badGuys[badGuys.length - 1].originalPos = {x: xOff + 5 + col * 90, y: 400 + 0 * 100}
      badGuys[badGuys.length - 1].events.shoot = function (pos) {
        badGuyShoot(pos)
      }

      if (level === 3) {
        badGuys[badGuys.length - 1].checkGone = true
        badGuys[badGuys.length - 1].path[1] = {
          p0: {"x": 800, "y": -200},
          p1: {"x": 512, "y": 200},
          p2: {"x": 1124, "y": 850},
          p3: {"x": 724, "y": 750},
          speed: 0.01
        }
      }

      col++
      if (col > 9) {
        col = 0
        row++
      }
      numAdded += 1
      if (numAdded >= goalToAdd) {
        addL1P5 = false
        countdown.event = function () {
          if (level === 1) {
            levelState = 6
            checkLevelOver = true
          } else if (level === 2 || level === 3){
            levelState = 4
            addL1P4 = true
            goalToAdd = 5
            numAdded = 0
          }
        }
        countdown.start(4000)
      }
    }
  }

  let paths = [
    [
      {
        p3: {x: xOff + col * 90, y: 100 + 0 * 100},
        p1: {"x": 512, "y": 200},
        p2: {"x": 512, "y": 400},
        p0: {"x": 500, "y": 500},
        speed: 0.01
      },
      {
        p0: {"x": -50, "y": 1100},
        p1: {"x": 512, "y": 800},
        p2: {"x": 500, "y": 500},
        p3: {"x": 500, "y": 500},
        speed: 0.01
      },
      {
        p0: {x: xOff + col * 90, y: 100 + 0 * 100},
        p1: {"x": 512, "y": 0},
        p2: {"x": 512, "y": 0},
        p3: {"x": 512, "y": -200},
        speed: 0.01
      },
    ],
    [
      {
        p3: {x: xOff + col * 90, y: 100 + 0 * 100},
        p1: {"x": 512, "y": 200},
        p2: {"x": 512, "y": 400},
        p0: {"x": 500, "y": 500},
        speed: 0.01
      },
      {
        p0: {"x": 1100, "y": 1100},
        p1: {"x": 512, "y": 800},
        p2: {"x": 500, "y": 500},
        p3: {"x": 500, "y": 500},
        speed: 0.01
      },
      {
        p0: {x: xOff + col * 90, y: 100 + 0 * 100},
        p1: {"x": 512, "y": 0},
        p2: {"x": 512, "y": 0},
        p3: {"x": 512, "y": -200},
        speed: 0.01
      },
    ]
  ]

  function divebomb (elapsedTime) {
    if (badGuys.length > 0) {
      addTime += elapsedTime
      if (addTime > addInt * 12) {
        addTime -= addInt * 12
         let i = Random.randIntRange(0, badGuys.length - 1)
        if (!badGuys[i].path) {
          let pi = Random.randIntRange(0, paths.length - 1)
          badGuys[i].path = [...paths[pi]]
          badGuys[i].path[0].p3 = {...badGuys[i].pos}
          badGuys[i].path[badGuys[i].path.length - 1].p0 = {...badGuys[i].originalPos}
          badGuys[i].pathIndex = 0
        }
      }
    }

  }

  function start () {
    end = false
    sounds.music3.currentTime = 0
    sounds.music3.play() 
    lockPlayer = true
    countdown.event = function () {
      lockPlayer = false
      startLevel1()
    }
    countdown.start(3000)
    Player.hide = false
    Player.dead = false
    lives = 2
    score = 0
    badGuys.length = 0
    endGameText1.hide = true
    endGameText2.hide = true
    endGameText3.hide = true
    setLiveSprites()
  }

  function startLevel1 () {
    checkLevelOver = false
    stageText.text = 'Stage 1'
    stageText.hide = false
    startLevelTimer.event = function () {
      stageText.hide = true
      addL1P1 = true
      levelState = 1
      level = 1
      numAdded = 0
      goalToAdd = 10
    }
    startLevelTimer.start(3000)
  }

  function startLevel2 () {
    checkLevelOver = false
    stageText.text = 'Stage 2'
    stageText.hide = false
    startLevelTimer.event = function () {
      stageText.hide = true
      addTime = 0
      addL1P3 = true
      levelState = 3
      level = 2
      goalToAdd = 5
      numAdded = 0
    }
    startLevelTimer.start(3000)
  }

  function startLevel3 () {
    checkLevelOver = false
    stageText.text = 'Challenge Stage'
    stageText.hide = false
    startLevelTimer.event = function () {
      stageText.hide = true
      level = 3
      addL1P1 = true
      goalToAdd = 10
      numAdded = 0
      levelState = 1
    }
    startLevelTimer.start(3000)
  }

  function updateHoldingOffset (elapsedTime) {
    let speed = 0.02
    if (holdingOffsetDirection < 2000) {
      holdingOffset.x += speed * elapsedTime
    } else {
      holdingOffset.x += -speed * elapsedTime
    }
    holdingOffsetDirection += elapsedTime
    if (holdingOffsetDirection > 4000) {
      holdingOffsetDirection = 0
    }
  }

  function reduce(numerator,denominator){
    var gcd = function gcd(a,b){
      return b ? gcd(b, a%b) : a;
    };
    gcd = gcd(numerator,denominator);
    return [numerator/gcd, denominator/gcd];
  }

  const menu = Menu()

  Player.events.playerDie = function (x, y) {
    console.log('dead')
    explosion.explosion(x, y)
    sounds.explosion.play()
    Player.dead = true
    Player.hide = true
    lives -= 1
    if (lives > -1) {
      playerTimer.event = function () {
        Player.pos.x = 512
        Player.hide = false
        explosion.edges(Player.pos.x - Player.width / 2, Player.pos.x + Player.width / 2, Player.pos.y + Player.height / 2)
        Player.dead = false
        setLiveSprites()
      }
      playerTimer.start(2000)
    } else {
      endGameText1.text = `Shots Fired: ${shotsFired}`
      endGameText1.hide = false
      endGameText2.text = `Number Hits: ${numHits}`
      endGameText2.hide = false
      let ratio = reduce(numHits, shotsFired)
      endGameText3.text = `Ratio Hit/Miss: ${ratio[0]}/${ratio[1]}`
      endGameText3.hide = false

      let added = false
      for (let i = 0; i < globals.highScores.length; i++) {
        if (score > globals.highScores[i]) {
          added = true
          globals.highScores.splice(i, 0, score)
          break;
        } 
      }
      if (!added) globals.highScores.push(score)
      storeGlobals()

      playerTimer.event = function () {
        gameState = 1
        sounds.music3.stop()
        menu.reset()
      }
      playerTimer.start(2000)
    }
  }
    
  let wait = 0
  
  function update(elapsedTime) {
    // for consoling
    wait += elapsedTime
    if (wait > 6000) {
      wait = 0
      // console.log(background)
      // console.log(badGuys)
    }

    if (stateChange) {
      stateChange = false
    }

    cam1.update(elapsedTime, input)
    
    switch (gameState) {
      case 1:
        menu.update(input)
        if (menu.play()) {
          gameState = 2
          globals.score = 0
          start()
        }
        break;
      case 2:
        countdown.update(elapsedTime)
        startLevelTimer.update(elapsedTime)
        playerTimer.update(elapsedTime)
        explosion.update(elapsedTime)
        scoreText.text = `Score: ${score}`
        if (input.keys.hasOwnProperty(globals.fire)) {
          if (lastShot > shotInterval) {
            playerShoot()
            lastShot = 0
          }
        }
        lastShot += elapsedTime

        switch (levelState) {
          case 1:
            if (addL1P1) {
              addL1P1Ships(elapsedTime)
            }
            break;
          case 2:
            if (addL1P2) {
              addL1P2Ships(elapsedTime)
            }
            break;
          case 3:
            if (addL1P3) {
              addL1P3Ships(elapsedTime)
            }
            break;
          case 4:
            if (addL1P4) {
              addL1P4Ships(elapsedTime)
            }
            break;
          case 5:
            if (addL1P5) {
              addL1P5Ships(elapsedTime)
            }
            break;
          case 6:
            divebomb(elapsedTime)
            break;
        }

        let newShots = [];
        for (let i = 0; i < playerShots.length; i++) {
          playerShots[i].collisionChecks = badGuys
          playerShots[i].update(elapsedTime, input);
          if (playerShots[i].time > 0 && !playerShots[i].deadAndDone) {
            newShots.push(playerShots[i]);
          }
          if (playerShots[i].dead) {
            numHits++
            playerShots[i].deadAndDone = true
          }
        }
        playerShots = newShots;

        updateHoldingOffset(elapsedTime)

        let newBadGuys = []
        allHome = true
        for (let i = 0; i < badGuys.length; i++) {
          if (Player.hide) {
            badGuys[i].collisionChecks = [...playerShots]
          } else {
            badGuys[i].collisionChecks = [...playerShots, player]
          }
          badGuys[i].update(elapsedTime, input)
          badGuys[i].holdingOffset = holdingOffset
          if (allHome && !badGuys[i].home) {
            allHome = false
          }
          if (!badGuys[i].dead) {
            newBadGuys.push(badGuys[i])
          }
        }
        badGuys = newBadGuys
        if (badGuys.length === 0) {
          allHome = false
        }
        if (checkLevelOver && badGuys.length === 0) {
          if (level === 1) {
            startLevel2()
          } else if (level === 2) {
            startLevel3()
          } else if (level === 3) {
            startLevel1()
          }
        }

        
        let newBadGuyShots = []
        for (let i = 0; i < badGuyShots.length; i++) {
          if (Player.hide) {
            badGuyShots[i].collisionChecks = []
          } else {
            badGuyShots[i].collisionChecks = [Player]
          }
          badGuyShots[i].update(elapsedTime, input)
          if (badGuyShots[i].time > 0 && !badGuyShots[i].deadAndDone) {
            newBadGuyShots.push(badGuyShots[i])
          }
          if (badGuyShots[i].dead) {
            badGuyShots[i].deadAndDone = true
          }
        }
        badGuyShots = newBadGuyShots
        
        if (!lockPlayer) {
          Player.collisionChecks = [...badGuyShots, ...badGuys]
          Player.update(elapsedTime, input);
        }
 
        break;
      default:
        break;
    }
    
    input.clear()
  }


  function gameLoop(time) {
    let elapsedTime = time - previousTime;
    previousTime = time;
    update(elapsedTime);

    switch (gameState) {
      case 1:
        render.frame([menu.renders])
        break;
      case 2:
        render.frame([
          [thrust, Player, explosion],
          livesSprites,
          playerShots,
          badGuys,
          badGuyShots,
          [stageText, scoreText, endGameText1, endGameText2, endGameText3]
        ]);
        break;
      default:
        break;
    }
    
    requestAnimationFrame(gameLoop);
  }

  requestAnimationFrame(gameLoop)
}