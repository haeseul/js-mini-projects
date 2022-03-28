;(function () {
  'use strict'

  const get = (target) => {
    return document.querySelector(target)
  }

  let timerId
  const $progressBar = get('.progress-bar')

  const throttle = (callback, time) => {
    // 실행할 때마다 timerId 초기화하기
    if (timerId) return
    timerId = setTimeout(() => {
      callback()
      timerId = undefined
    }, time);
  }


  const onScroll = () => {
    const height = 
      document.documentElement.scrollHeight - 
      document.documentElement.clientHeight

    const scrollTop = document.documentElement.scrollTop

    // 콘텐츠 길이가 아닌 공간 중 스크롤바 수직 위치의 비율
    const width = (scrollTop / height) * 100
    $progressBar.style.width = width + '%'
  }


  window.addEventListener('scroll', () => throttle(onScroll, 100))
})()
