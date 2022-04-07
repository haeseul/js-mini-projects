;(function () {
  'use strict'

  const get = (target) => {
    return document.querySelector(target)
  }

  class Stopwatch {
    constructor(element) {
      this.timer = element
      this.interval = null
      this.defaultTime = '00:00.00'
      this.startTime = 0
      this.elasedTime = 0   // 경과된 시간
    }

    addZero(number) {
      if (number < 10) {
        return '0' + number
      }
      if (number > 99) {  // millisecond를 2자리수까지만 나타냄
        return number.toString().slice(0, -1)
      }
      return number
    }

    timeToString(time) {
      const date = new Date(time)
      const minutes = date.getUTCMinutes()
      const seconds = date.getUTCSeconds()
      const millisecond = date.getUTCMilliseconds()
      return `${this.addZero(minutes)}:${this.addZero(seconds)}.${this.addZero(millisecond)}`
    }

    print(text) {
      this.timer.innerHTML = text
    }

    startTimer() {
      this.elasedTime = Date.now() - this.startTime
      const time = this.timeToString(this.elasedTime)
      this.print(time)
    }

    start() {
      // claerInterval을 해주어야 start 버튼을 여러번 눌러도 오류X
      clearInterval(this.interval)
      this.startTime = Date.now() - this.elasedTime
      this.interval = setInterval(this.startTimer.bind(this), 10)
      // 전역 this(window)가 아님을 binding으로 선언
    }

    stop() {
      clearInterval(this.interval)
    }
    
    reset() {
      clearInterval(this.interval)
      this.print(this.defaultTime)
      this.interval = null
      this.startTime = 0
      this.elasedTime = 0
    }
  }

  const $startButton = get('.timer_button.start')
  const $stopButton = get('.timer_button.stop')
  const $resetButton = get('.timer_button.reset')
  const $timer = get('.timer')
  const stopwatch = new Stopwatch($timer)

  $startButton.addEventListener('click', () => {
    stopwatch.start()
  })

  $stopButton.addEventListener('click', () => {
    stopwatch.stop()
  })

  $resetButton.addEventListener('click', () => {
    stopwatch.reset()
  })

})()
