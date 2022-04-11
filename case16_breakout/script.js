;(function () {
  'use strict'

  const get = (element) => document.querySelector(element)

  const keyEvent = (control, func) => {
    document.addEventListener(control, func, false)
  }

  class BrickBreak {
    constructor(parent = 'body', data = {}) {
      this.parent = get(parent)
      this.canvas = document.createElement('canvas')
      this.canvas.setAttribute('width', '480')
      this.canvas.setAttribute('height', '340')
      this.ctx = this.canvas.getContext('2d')
      this.fontFamily = "20px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"
      this.score = 0
      this.lives = data.lives
      this.speed = data.speed
      this.image = document.createElement('img')
      this.bg = data.bg
      this.radius = 10
      this.ballX = this.canvas.width / 2
      this.ballY = this.canvas.height - 30
      this.directX = data.speed
      this.directY = -data.speed
      this.paddleWidth = data.paddleWidth
      this.paddleHeight = data.paddleHeight
      this.rightPressed = false
      this.leftPressed = false
      this.paddleX = (this.canvas.width - this.paddleWidth) / 2
      this.brickRow = data.brickRow
      this.brickCol = data.brickCol
      this.brickWidth = data.brickWidth
      this.brickHeight = data.brickHeight
      this.brickPad = data.brickPad
      this.brickPosX = data.brickPosX
      this.brickPosY = data.brickPosY
      this.ballColor = data.ballColor
      this.paddleColor = data.paddleColor
      this.fontColor = data.fontColor
      this.brickStartColor = data.brickStartColor
      this.brickEndColor = data.brickEndColor
      this.image.setAttribute('src', this.bg)
      this.parent.appendChild(this.canvas)
      this.bricks = []
    }

    init = () => {
      // 벽돌 배열 만들기
      for (let colIndex = 0; colIndex < this.brickCol; colIndex++) {
        this.bricks[colIndex] = []
        for (let rowIndex = 0; rowIndex < this.brickRow; rowIndex++) {
          this.bricks[colIndex][rowIndex] = { x: 0, y: 0, status: 1 }
        }
      }
      this.keyEvent()
      this.draw()
    }

    keyupEvent = (event) => {
      if ('Right' === event.key || 'ArrowRight' === event.key) {
        this.rightPressed = false
      } else if ('Left' === event.key || 'ArrowLeft' === event.key) {
        this.leftPressed = false
      }
    }

    keydownEvent = (event) => {
      if ('Right' === event.key || 'ArrowRight' === event.key) {
        this.rightPressed = true
      } else if ('Left' === event.key || 'ArrowLeft' === event.key) {
        this.leftPressed = true
      }
    }

    mousemoveEvent = (event) => {
      // 마우스의 위치
      const positionX = event.clientX - this.canvas.offsetLeft

      if (0 < positionX && positionX < this.canvas.width) {
        this.paddleX = positionX - this.paddleWidth / 2
      }
    }

    keyEvent = () => {
      keyEvent('keyup', this.keyupEvent)
      keyEvent('keydown', this.keydownEvent)
      keyEvent('mousemove', this.mousemoveEvent)
    }

    drawBall = () => {
      this.ctx.beginPath()
      this.ctx.fillStyle = this.ballColor
      this.ctx.arc(this.ballX, this.ballY, this.radius, 0, Math.PI * 2)
      this.ctx.fill()
      this.ctx.closePath()
    }

    drawPaddle = () => {
      this.ctx.beginPath()
      this.ctx.rect(
        this.paddleX,
        this.canvas.height - this.paddleHeight,
        this.paddleWidth,
        this.paddleHeight
      )
      this.ctx.fillStyle = this.paddleColor
      this.ctx.fill()
      this.ctx.closePath()
    }

    drawBricks = () => {
      let brickX = 0
      let brickY = 0
      let gradient = this.ctx.createLinearGradient(0,0,200,0)
      gradient.addColorStop(0, this.brickStartColor)
      gradient.addColorStop(1, this.brickEndColor)

      for (let colIndex=0; colIndex<this.brickCol; colIndex++) {
        for (let rowIndex=0; rowIndex<this.brickRow; rowIndex++) {
          if (1 !== this.bricks[colIndex][rowIndex].status) {
            continue  // status가 0이면 블록 안 보이게
          }
          brickX = colIndex * (this.brickWidth + this.brickPad) + this.brickPosX
          brickY = rowIndex * (this.brickHeight + this.brickPad) + this.brickPosY

          this.bricks[colIndex][rowIndex].x = brickX
          this.bricks[colIndex][rowIndex].y = brickY

          this.ctx.beginPath()
          this.ctx.rect(brickX, brickY, this.brickWidth, this.brickHeight)
          this.ctx.fillStyle = gradient
          this.ctx.fill()
          this.ctx.closePath()
        }
      }
    }

    drawScore = () => {
      this.ctx.font = this.fontFamily
      this.ctx.fillStyle = '#ffffff'
      this.ctx.fillText('점수 : ' + this.score, 10, 22)
    }
    
    drawLives = () => {
      this.ctx.font = this.fontFamily
      this.ctx.fillStyle = '#ffffff'
      this.ctx.fillText('목숨 : ' + this.lives, this.canvas.width - 78, 22)
    }

    detectCollision = () => {
      let currentBrick = {}

      for (let colIndex=0; colIndex<this.brickCol; colIndex++) {
        for (let rowIndex=0; rowIndex<this.brickRow; rowIndex++) {
          currentBrick = this.bricks[colIndex][rowIndex]

          if (1 !== currentBrick.status) {
            continue  // status가 0이면 블록 안 보이게 (깨진 상태)
          }

          if (
            // ball이 currentBrick의 어느 부분이라도 만나면
            this.ballX > currentBrick.x &&
            this.ballX < currentBrick.x + this.brickWidth &&
            this.ballY > currentBrick.y &&
            this.ballY < currentBrick.y + this.brickHeight
          ) {
            this.directY = -this.directY  // ball 방향전환
            currentBrick.status = 0       // 벽돌깨짐
            this.score++

            if (this.score !== this.brickCol * this.brickRow) {
              continue
            }
            alert('승리했습니다!')
            this.reset()
          }
        }
      }
    }

    draw = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

      // 백그라운드 설정
      this.ctx.drawImage(
        this.image,
        this.canvas.width / 2 - this.image.width / 2,
        this.canvas.height / 2 - this.image.height / 2
      )

      this.drawBall()
      this.drawPaddle()
      this.drawBricks()
      this.drawScore()
      this.drawLives()
      this.detectCollision()

      // ball control (벽)
      if (this.ballX + this.directX > this.canvas.width - this.radius || this.ballX + this.directX < this.radius) {
        this.directX = -this.directX
      }
      // ball control (천장)
      if (this.ballY + this.directY < this.radius) {
        this.directY = -this.directY
      } else if (this.ballY + this.directY > this.canvas.height - this.radius) {
        // 패들에 부딪힌 경우
        if (this.ballX > this.paddleX && this.ballX < this.paddleX + this.paddleWidth) {
          this.directY = -this.directY
        } else {
          this.lives--
          if (this.lives === 0) {
            alert('실패하였습니다.')
            this.reset()
          } else {
            // 목숨이 남은 경우 초기화
            this.ballX = this.canvas.width / 2
            this.ballY = this.canvas.height - this.paddleHeight
            this.directX = this.speed
            this.directY = -this.speed
            this.paddleX = (this.canvas.width - this.paddleWidth) / 2
          }
        }
      }

      // paddle move
      if (this.rightPressed && this.paddleX < this.canvas.width - this.paddleWidth) {
        this.paddleX += 7
      } else if (this.leftPressed && 0 < this.paddleX) {
        this.paddleX -= 7
      }
      
      this.ballX += this.directX
      this.ballY += this.directY

      requestAnimationFrame(this.draw)
    }

    reset = () => {
      document.location.reload()
    }
  }

  const data = {
    lives: 5,
    speed: 2,
    paddleHeight: 10,
    paddleWidth: 75,
    bg: './assets/bg.jpeg',
    ballColor: '#04bf55',
    paddleColor: '#05aff2',
    fontColor: '#f2bb16',
    brickStartColor: '#f29f05',
    brickEndColor: '#f21905',
    brickRow: 3,
    brickCol: 5,
    brickWidth: 75,
    brickHeight: 20,
    brickPad: 10,
    brickPosX: 30,
    brickPosY: 30,
  }

  const brickBreak = new BrickBreak('.canvas', data)
  brickBreak.init()
})()
