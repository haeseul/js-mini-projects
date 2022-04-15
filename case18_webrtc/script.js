;(() => {
  'use strict'

  const get = (element) => document.querySelector(element)
  const allowUser = {
    audio: true,
    video: true,
  }

  class WebRtc {
    constructor() {
      this.media = new MediaSource()
      this.recorder
      this.blobs
      this.playedVideo = get('video.played')
      this.recordVideo = get('video.record')
      this.btnDownload = get('.btn_download')
      this.btnRecord = get('.btn_record')
      this.btnPlay = get('.btn_play')
      this.container = get('.webrtc')
      this.events()
      navigator.mediaDevices.getUserMedia(allowUser).then((videoAudio) => {
        this.success(videoAudio)
      })
    }

    events() {
      this.btnRecord.addEventListener('click', this.toggleRecord.bind(this))
      this.btnPlay.addEventListener('click', this.play.bind(this))
      this.btnDownload.addEventListener('click', this.download.bind(this))
    }

    success(audioVideo) {
      this.btnRecord.removeAttribute('disabled')
      window.stream = audioVideo
      if (window.URL) {
        this.playedVideo.setAttribute(
          'src',
          window.URL.createObjectURL(audioVideo)
        )
      } else {
        // 비디오 태그 자체에서 재생
        this.playedVideo.setAttribute('src', audioVideo)
      }
    }

    toggleRecord() {
      if ('녹화' === this.btnRecord.textContent) {
        this.startRecord()
      } else {
        // 녹화가 다 된 상태
        this.btnPlay.removeAttribute('disabled')
        this.btnDownload.removeAttribute('disabled')
        this.btnRecord.textContent = '녹화'
        this.stopRecord()
      }
    }

    pushBlobData(event) {
      if (!event.data || event.data.size < 1) {
        return
      }
      this.blobs.push(event.data)
    }

    startRecord() {
      let type = {mimeType: 'video/webm;codecs=vp9'}
      this.blobs = []
      if (!MediaRecorder.isTypeSupported(type.mimeType)) {
        type = {mimeType: 'video/webm'}
      }
      this.recorder = new MediaRecorder(window.stream, type)
      this.btnRecord.textContent = '중지'
      this.btnPlay.setAttribute('disabled', true)
      this.btnDownload.setAttribute('disabled', true)
      // 레코딩이 시작되면 데이터가 available 속성 가짐 -> blob data로 인식되면서 다운로드 가능해짐
      this.recorder.ondataavailable = this.pushBlobData.bind(this)
      this.recorder.start(20) // 20초 가량 녹화 가능
    }

    stopRecord() {
      this.recorder.stop()
      this.recordVideo.setAttribute('controls', true) // 비디오 재생 가능 상태로 만들어줌
    }

    play() {
      this.recordVideo.src = window.URL.createObjectURL(
        new Blob(this.blobs, {type: 'video/webm'})
      )
    }

    download() {
      const videoFile = new Blob(this.blobs, {type: 'video/webm'})
      const url = window.URL.createObjectURL(videoFile)
      const downloader = document.createElement('a')
      downloader.style.display = 'none'
      downloader.setAttribute('href', url)
      downloader.setAttribute('download', 'test_video.webm')  // 해당 파일명으로 생성
      this.container.appendChild(downloader)
      downloader.click()  // click 후 src에 blob 되어있던 webm 파일이 test_video.webm 으로 다운로드  됨
      setTimeout(() => {
        this.container.removeChild(downloader)
        window.URL.revokeObjectURL(url)
      }, 100);
    }
  }

  new WebRtc()
})()
