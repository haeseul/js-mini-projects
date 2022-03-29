;(function () {
  'use strict'

  const get = (target) => document.querySelector(target)

  const $canvas = get('.canvas')
  const ctx = $canvas.getContext('2d')

  const $score = get('.score')
  const $highscore = get('.highscore')
  const $play = get('.js-play')

  const colorSet = {
    board: 'rgb(20, 105, 38)',
    snakeHead: 'rgba(229, 65, 120, 0.929)',
    snakeBody: 'rgba(153, 206, 244, 0.498)',
    food: 'rgb(66, 187, 103)',
  }

  let start = 0
  let option = {
    highScore: localStorage.getItem('score') || 0,
    gameEnd: true,
    direction: 2, // 우측으로 이동
    snake: [
      {x:10, y:10, direction:2},
      {x:10, y:20, direction:2},
      {x:10, y:30, direction:2},
    ],
    food: {x:0, y:0},
    score: 0,
  }

  const init = () => {
    document.addEventListener('keydown', (event) => {
      if (!/Arrow/gi.test(event.key)) return
      event.preventDefault()
      const direction = getDirection(event.key)
      if (!isDirectionCorrect(direction)) return
      option.direction = direction
    })

    $play.onclick = () => {
      if (option.gameEnd) {
        option = {
          highScore: localStorage.getItem('score') || 0,
          gameEnd: false,
          direction: 2,
          snake: [
            { x: 10, y: 10, direction: 2 },
            { x: 10, y: 20, direction: 2 },
            { x: 10, y: 30, direction: 2 },
          ],
          food: { x: 0, y: 0 },
          score: 0,
        }
        $score.innerHTML = `점수 : 0점`
        $highscore.innerHTML = `최고점수 : ${option.highScore}점`
        randomFood()
        // play 재귀함수로 반복적인 애니메이션 구현
        window.requestAnimationFrame(play)
      }
    }
  }


  const buildBoard = () => {
    ctx.fillStyle = colorSet.board
    ctx.fillRect(0, 0, 300, 300)
  }

  const buildSnake = (ctx, x, y, head=false) => {
    ctx.fillStyle = head ? colorSet.snakeHead : colorSet.snakeBody
    ctx.fillRect(x, y, 10, 10)
  }

  const buildFood = (ctx, x, y) => {
    ctx.beginPath()
    ctx.fillStyle = colorSet.food
    ctx.arc(x+5, y+5, 5, 0, 2*Math.PI)
    ctx.fill()
  }

  // 지렁이 그리기
  const setSnake = () => {
    for (let i=option.snake.length-1; i>=0; --i) {
      buildSnake(ctx, option.snake[i].x, option.snake[i].y, i===0) 
      // 마지막에 i=0이 되면 head=true -> 머리 그리기
    }
  }

  const setDirection = (number, value) => {
    while (value < 0) {
      value += number // 화면을 벗어난 경우 300을 더해줌
    }
    return value % number
  }

  // 지렁이 몸통 늘어나기
  const setBody = () => {
    const tail = option.snake[option.snake.length - 1]
    const direction = tail.direction
    let x = tail.x
    let y = tail.y
    switch (direction) {
      case 1:   // down
        y = setDirection(300, y-10)
        break;
      case -1:  // up
        y = setDirection(300, y+10)
        break;
      case -2:   // left
        y = setDirection(300, x+10)
        break;
      case 2:  // right
        y = setDirection(300, x-10)
        break;
    }
    option.snake.push({x,y,direction})  // 지렁이 꼬리에 push
  }

  // 음식을 먹은 경우
  const getFood = () => {
    const snakeX = option.snake[0].x
    const snakeY = option.snake[0].y
    const foodX = option.food.x
    const foodY = option.food.y
    if (snakeX == foodX && snakeY == foodY) {
      option.score++
      $score.innerHTML = `점수 : ${option.score}점`
      setBody()
      randomFood()
    }
  }

  // 음식 재할당
  const randomFood = () => {
    // 300x300 공간 중 250x250 내에 생성
    let x = Math.floor(Math.random() * 25) * 10
    let y = Math.floor(Math.random() * 25) * 10
    // some() : 배열 중 일치하는 요소를 하나라도 만나면 return
    // 지렁이가 움직이는 위치에 음식이 있다면 재배치
    while (option.snake.some((part) => part.x === x && part.y === y)) {
      x = Math.floor(Math.random() * 25) * 10
      y = Math.floor(Math.random() * 25) * 10
    }
    // food에 x,y 할당
    option.food = {x, y}
  }


  const play = (timestamp) => {
    start++
    if (option.gameEnd) return
    if (timestamp - start > 1000 / 10) {
      buildBoard()
      buildFood(ctx, option.food.x, option.food.y)
      setSnake()
      getFood()
      start = timestamp
    }
    window.requestAnimationFrame(play)
    // if (isGameOver()) {
    //   option.gameEnd = true
    //   setHighScore()
    //   alert('게임오버')
    //   return
    // }
  }

  init()
})()
