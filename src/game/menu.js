import Text from '../engine/objects/text'

import { globals, storeGlobals, getGlobals } from './globals'

export default function () {
  let that = {
    renders: [],
    play: false
  }

  // let selectState = 1
  let menuState = 'main'

  let name = new Text({
    text: 'Galaga',
    font: '100px spaceAge',
    fillStyle: 'white',
    pos: {x: 100, y: 100},
  })

  let play = new Text({
    text: 'Play',
    font: '100px spaceAge',
    fillStyle: 'white',
    pos: {x: 100, y: 500},
  })

  let changeInput = new Text({
    text: 'Change Input',
    font: '100px spaceAge',
    fillStyle: 'gray',
    pos: {x: 100, y: 600},
  })

  let credits = new Text({
    text: 'Credits',
    font: '100px spaceAge',
    fillStyle: 'gray',
    pos: {x: 100, y: 700},
  })

  let highScore = new Text({
    text: 'High Scores',
    font: '100px spaceAge',
    fillStyle: 'gray',
    pos: {x: 100, y: 800},
  })
  
  let creditsContent = new Text({
    text: 'Made by Jacob Strong',
    font: '40px spaceAge',
    fillStyle: 'white',
    pos: {x: 100, y: 600},
  })

  let instructions = new Text({
    text: 'Click on action, then press new key',
    font: '45px spaceAge',
    fillStyle: 'white',
    pos: {x: 100, y: 250},
  })

  let back = new Text({
    text: 'back',
    font: '100px spaceAge',
    fillStyle: 'gray',
    pos: {x: 100, y: 900},
  })

  let pitchLeft = new Text({
    text: 'Move Left: ' + globals.left,
    font: '70px spaceAge',
    fillStyle: 'gray',
    pos: {x: 100, y: 400},
  })
  
  let pitchRight = new Text({
    text: 'Move Right: ' + globals.right,
    font: '70px spaceAge',
    fillStyle: 'gray',
    pos: {x: 100, y: 500},
  })
  
  let thrust = new Text({
    text: 'Fire: ' + (globals.fire === ' ' ? ' Space' : globals.fire),
    font: '70px spaceAge',
    fillStyle: 'gray',
    pos: {x: 100, y: 600},
  })
  
  let highScoreContent = new Text({
    text: 'High Scores',
    font: '70px spaceAge',
    fillStyle: 'white',
    pos: {x: 100, y: 300},
  })

  let waitingText = new Text({
    text: 'Waiting For Input',
    font: '80px spaceAge',
    fillStyle: 'white',
    pos: {x: 100, y: 700},
    hide: true
  })

  let highScores = []
  
  function updateHighScores() {
    highScores = []
    for (let i = 0; i < globals.highScores.length; i++) {
      if (i > 9) return
      highScores.push(
        new Text({
          text: String(i + 1) + ': ' + globals.highScores[i],
          font: '50px spaceAge',
          fillStyle: 'gray',
          pos: {x: 100, y: 400 + (i * 50)},
        })
      )
    }
  }
  updateHighScores()

  function getRenders() {
    that.renders.length = 0
    that.renders.push(name)
    switch (menuState) {
      case 'main':
        that.renders.push(play)
        that.renders.push(changeInput)
        that.renders.push(credits)
        that.renders.push(highScore)
        break;
      case 'credits':
        that.renders.push(creditsContent)
        that.renders.push(back)
        break;
      case 'change':
        that.renders.push(instructions)
        that.renders.push(pitchLeft)
        that.renders.push(pitchRight)
        that.renders.push(thrust)
        that.renders.push(waitingText)
        that.renders.push(back)
        break;
      case 'high':
        that.renders.push(highScoreContent)
        that.renders.push(back)
        highScores.forEach(el => {
          that.renders.push(el)
        });
      default:
        break;
    }
    return that.renders
  }

  function changeToPlay() {
    // selectState = 1
    play.fillStyle = 'white'
    credits.fillStyle = 'gray'
  }

  function changeToCredits() {
    // selectState = 2
    play.fillStyle = 'gray'
    credits.fillStyle = 'white'
  }

  function changeToCredits() {
    // selectState = 2
    play.fillStyle = 'gray'
    credits.fillStyle = 'white'
  }

  function isOverPlay(mouseLocation) {
    return checkOverlay(mouseLocation, play.pos.y)
  }

  function isOverCredits(mouseLocation) {
    return checkOverlay(mouseLocation, credits.pos.y)
  }

  function isOverChange(mouseLocation) {
    return checkOverlay(mouseLocation, changeInput.pos.y)
  }

  function isOverHigh(mouseLocation) {
    return checkOverlay(mouseLocation, highScore.pos.y)
  }

  function isOverBack(mouseLocation) {
    return checkOverlay(mouseLocation, back.pos.y)
  }

  function isOverPitchLeft(mouseLocation) {
    return checkOverlay(mouseLocation, pitchLeft.pos.y)
  }
  function isOverPitchRight(mouseLocation) {
    return checkOverlay(mouseLocation, pitchRight.pos.y)
  }
  function isOverThrust(mouseLocation) {
    return checkOverlay(mouseLocation, thrust.pos.y)
  }

  function updateKeyText() {
    pitchLeft.text = 'Pitch Left: ' + globals.left
    pitchRight.text = 'Pitch Right: ' + globals.right
    thrust.text = 'Fire: ' + (globals.fire === ' ' ? ' space' : globals.fire)
  }

  let waitForInput = false
  let inputKey = ''

  function checkOverlay(mouseLocation, y) {
    if (mouseLocation.y >= y - 100 && mouseLocation.y <= y) {
      return true
    } else {
      return false
    }
  }

  that.update = function (input) {
    getRenders()

    if (waitForInput) {
      // console.log(input.keyPress)
      if(Object.keys(input.keyPress).length > 0) {
        console.log(Object.keys(input.keyPress)[0])
        globals[inputKey] = Object.keys(input.keyPress)[0]
        storeGlobals()
        waitForInput = false
        waitingText.hide = true
        updateKeyText()
      }
    }

    if (isOverPlay(input.mouseLocation) && menuState === 'main') {
      play.fillStyle = 'white'
      changeInput.fillStyle = 'gray'
      credits.fillStyle = 'gray'
      highScore.fillStyle = 'gray'
    } else if (isOverChange(input.mouseLocation) && menuState === 'main') {
      play.fillStyle = 'gray'
      changeInput.fillStyle = 'white'
      credits.fillStyle = 'gray'
      highScore.fillStyle = 'gray'
    } else if (isOverCredits(input.mouseLocation) && menuState === 'main') {
      play.fillStyle = 'gray'
      changeInput.fillStyle = 'gray'
      credits.fillStyle = 'white'
      highScore.fillStyle = 'gray'
    } else if (isOverHigh(input.mouseLocation) && menuState === 'main') {
      play.fillStyle = 'gray'
      changeInput.fillStyle = 'gray'
      credits.fillStyle = 'gray'
      highScore.fillStyle = 'white'
    }

    // if (menuState === 'credits') {
    if (isOverBack(input.mouseLocation)) {
      back.fillStyle = 'white'
    } else {
      back.fillStyle = 'gray'
    }
    // }
    if (menuState === 'change') {
      if (isOverPitchLeft(input.mouseLocation)) {
        if (input.mouseClick) {
          waitingText.hide = false
          waitForInput = true
          inputKey = 'left'
        }
        pitchLeft.fillStyle = 'white'
        pitchRight.fillStyle = 'gray'
        thrust.fillStyle = 'gray'
      } else if (isOverPitchRight(input.mouseLocation)) {
        if (input.mouseClick) {
          waitingText.hide = false
          waitForInput = true
          inputKey = 'right'
        }
        pitchLeft.fillStyle = 'gray'
        pitchRight.fillStyle = 'white'
        thrust.fillStyle = 'gray'
      } else if (isOverThrust(input.mouseLocation)) {
        if (input.mouseClick) {
          waitingText.hide = false
          waitForInput = true
          inputKey = 'fire'
        }
        pitchLeft.fillStyle = 'gray'
        pitchRight.fillStyle = 'gray'
        thrust.fillStyle = 'white'
      }
    }

    if (input.mouseClick) {
      if (isOverPlay(input.mouseLocation) && menuState === 'main') {
        that.play = true
      }
      if (isOverCredits(input.mouseLocation) && menuState === 'main') {
        menuState = 'credits'
      }
      if (isOverBack(input.mouseLocation) && (menuState === 'credits' || menuState === 'change' || menuState === 'high')) {
        menuState = 'main'
      }
      if (isOverChange(input.mouseLocation) && menuState === 'main') {
        menuState = 'change'
      }
      if (isOverHigh(input.mouseLocation) && menuState === 'main') {
        menuState = 'high'
        updateHighScores()
      }
    }
  }

  return {
    renders: that.renders,
    update: that.update,
    play: function () {return that.play},
    reset: function () {that.play = false}
  }
}