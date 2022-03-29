;(function () {
  'use strict'

  const get = (target) => document.querySelector(target)
  const getAll = (target) => document.querySelectorAll(target)

  const $search = get('#search')
  const $list = getAll('.contents.list figure')
  const $searchButton = get('.btn_search')

  const $player = get('.view video')
  const $btnPlay = get('.js-play')
  const $btnReplay = get('.js-replay')
  const $btnStop = get('.js-stop')
  const $btnMute = get('.js-mute')
  const $progress = get('.js-progress')
  const $volume = get('.js-volume')
  const $fullscreen = get('.js-fullScreen')
  

  const init = () => {
    $search.addEventListener('keyup', search)
    $searchButton.addEventListener('click', search)

    for (let index=0; index < $list.length; index++) {
      const $target = $list[index].querySelector('picture')
      $target.addEventListener('mouseover', onMouseOver)
      $target.addEventListener('mouseout', onMouseOut)
    }

    // 썸네일 클릭 시 뷰페이지 진입 -> hash와 DecodeURI 사용
    for (let index = 0; index < $list.length; index++) {
      $list[index].addEventListener('click', hashChange)
    }

    // hash값이 바뀌게 되면 뷰페이지가 맞는지 체크 (hash값에 view가 포함되었는지)
    window.addEventListener('hashchange', () => {
      const isView = -1 < window.location.hash.indexOf('view')
      if (isView) {
        getViewPage()
      } else {
        getListPage()
      }
    })

    // 비디오 컨트롤
    viewPageEvent()
  }


  const search = () => {
    let searchText = $search.value.toLowerCase()

    // 콘텐츠 개수만큼 반복
    for (let index=0; index < $list.length; index++) {
      const $target = $list[index].querySelector('strong')  // 제목(strong 태그)으로 검색
      const text = $target.textContent.toLowerCase()

      // 대상 텍스트가 제목문자열에 존재하는지 (인덱스 0부터 시작했을 때 존재하는지)
      if (-1 < text.indexOf(searchText)) {
        $list[index].style.display = 'flex'
      } else {
        $list[index].style.display = 'none'
      }
    }
  }


  const onMouseOver = (e) => {
    // target의 부모노드로 이동한 후 'source' 태그를 찾는다
    const webPlay = e.target.parentNode.querySelector('source')
    webPlay.setAttribute('srcset', './assets/sample.webp')
  }

  const onMouseOut = (e) => {
    const webPlay = e.target.parentNode.querySelector('source')
    webPlay.setAttribute('srcset', './assets/sample.jpg')
  }

  const hashChange = (e) => {
    e.preventDefault()  // 기존 해시동작 중단
    const parentNode = e.target.closest('figure')
    const viewTitle = parentNode.querySelector('strong').textContent
    window.location.hash = `view&${viewTitle}` // 자동으로 hashchange 이벤트 발생 (isView=True)
    getViewPage()
  }

  const getViewPage = () => {
    const viewTitle = get('.view strong')
    const urlTitle = decodeURI(window.location.hash.split('&')[1])  // view&${viewTitle} 중 ${viewTitle}만 가져오기
    viewTitle.innerText = urlTitle

    get('.list').style.display = 'none'
    get('.view').style.display = 'flex'
  }

  const getListPage = () => {
    get('.list').style.display = 'flex'
    get('.view').style.display = 'none'
  }


  // 비디오 컨트롤
  const buttonChange = (btn, value) => {
    btn.innerHTML = value
  }

  const viewPageEvent = () => {
    $volume.addEventListener('change', (e) => {
      $player.volume = e.target.value
    })

    $player.addEventListener('timeupdate', setProgress)   // progress bar 이동
    $player.addEventListener('play', buttonChange($btnPlay, 'Pause'))
    $player.addEventListener('pause', buttonChange($btnPlay, 'Play'))
    $player.addEventListener('volumeChange', () => {
      $player.muted
       ? buttonChange($btnMute, 'unmute')
       : buttonChange($btnMute, 'mute')
    })
    $player.addEventListener('ended', $player.pause())
    $progress.addEventListener('click', getCurrent)
    $btnPlay.addEventListener('click', playVideo)
    $btnStop.addEventListener('click', stopVideo)
    $btnReplay.addEventListener('click', replayVideo)
    $btnMute.addEventListener('click', mute)
    $fullscreen.addEventListener('click', fullScreen)
  }

  const getCurrent = (e) => {
    let percent = e.offsetX / $progress.offsetWidth
    $player.currentTime = percent * $player.duration
    e.target.value = Math.floor(percent / 100)
  }

  const setProgress = () => {
    let percentage = Math.floor((100 / $player.duration) * $player.currentTime)
    $progress.value = percentage
  }

  const playVideo = () => {
    if ($player.paused || $player.ended) {
      buttonChange($btnPlay, 'Pause')
      $player.play()
    } else {
      buttonChange($btnPlay, 'Play')
      $player.pause()
    }
  }

  const stopVideo = () => {
    $player.pause()
    $player.currentTime = 0
    buttonChange($btnPlay, 'Play')
  }

  const resetPlayer = () => {
    $progress.value = 0
    $player.currentTime = 0
  }

  const replayVideo = () => {
    resetPlayer()
    $player.play()
    buttonChange($btnPlay, 'Pause')
  }

  const mute = () => {
    if ($player.muted) {
      buttonChange($btnMute, 'Unmute')
      $player.muted = false
    } else {
      buttonChange($btnMute, 'Mute')
      $player.muted = true
    }
  }

  const fullScreen = () => {
    if ($player.requestFullscreen) {
      if (document.fullscreenElement) { // fullscreen 상태라면
        document.cancelFullScreen()
      } else {
        $player.requestFullscreen()
      }
    }
    else if ($player.msRequestFullscreen)
      if (document.msFullscreenElement) {
        document.msExitFullscreen()
      } else {
        $player.msRequestFullscreen()
      }
    else if ($player.mozRequestFullScreen)
      if (document.mozFullScreenElement) {
        document.mozCancelFullScreen()
      } else {
        $player.mozRequestFullScreen()
      }
    else if ($player.webkitRequestFullscreen)
      if (document.webkitFullscreenElement) {
        document.webkitCancelFullScreen()
      } else {
        $player.webkitRequestFullscreen()
      }
    else {
      alert('Not Supported')
    }
  }

  init()

})()
