;(function () {
  'use strict'

  const get = (element) => document.querySelector(element)

  class PhotoEditor {
    constructor() {
      this.container = get('main')
      this.canvas = get('canvas')
      this.ctx = this.canvas.getContext('2d')
      this.width = 700
      this.height = 411
      this.minSize = 20
      this.canvas.width = this.width
      this.canvas.height = this.height
      this.ctx.lineWidth = 4
      this.ctx.strokeStyle = '#ff0000'

      this.targetImage = get('.image_wrap')
      this.targetCanvas = document.createElement('canvas')
      this.targetCtx = this.targetCanvas.getContext('2d')
      this.targetWidth  // 크롭할 때의 넓이
      this.targetHeight

      this.sourceX  // 왼편에 위치한 이미지의 X값
      this.sourceY
      this.sourceWidth

      this.img = new Image()
      this.btnFlip = get('.btn_flip')
      this.btnSepia = get('.btn_sepia')
      this.btnGray = get('.btn_gray')
      this.btnSave = get('.btn_save')
      this.fileDrag = get('.drag_area') // 파일 그래그할 위치
      this.fileInput = get('.drag_area input')
      this.fileImage = get('.fileImage')
      this.clickEvent()
      this.fileEvent()
      this.drawEvent()
    }

    clickEvent() {
      this.btnFlip.addEventListener('click', this.flipEvent.bind(this))
      this.btnSepia.addEventListener('click', this.sepiaEvent.bind(this))
      this.btnGray.addEventListener('click', this.grayEvent.bind(this))
      this.btnSave.addEventListener('click', this.download.bind(this))
    }

    flipEvent() {
      this.targetCtx.translate(this.targetWidth, 0)
      this.targetCtx.scale(-1, 1)
      this.targetCtx.drawImage(
        this.img,
        this.sourceX,
        this.sourceY,
        this.sourceWidth,
        this.sourceHeight,
        0,
        0,
        this.targetWidth,
        this.targetHeight
      )
    }
    
    sepiaEvent() {
      this.targetCtx.clearRect(0, 0, this.targetWidth, this.targetHeight)
      this.targetCtx.filter = 'sepia(1)'
      this.targetCtx.drawImage(
        this.img,
        this.sourceX,
        this.sourceY,
        this.sourceWidth,
        this.sourceHeight,
        0,
        0,
        this.targetWidth,
        this.targetHeight
      )
    }
    
    grayEvent() {
      this.targetCtx.clearRect(0, 0, this.targetWidth, this.targetHeight)
      this.targetCtx.filter = 'grayscale(1)'
      this.targetCtx.drawImage(
        this.img,
        this.sourceX,
        this.sourceY,
        this.sourceWidth,
        this.sourceHeight,
        0,
        0,
        this.targetWidth,
        this.targetHeight
      )
    }
    
    download() {
      const url = this.targetCanvas.toDataURL()
      const downloader = document.createElement('a')
      downloader.style.display = 'none'
      downloader.setAttribute('href', url)
      downloader.setAttribute('download', 'canvas.png')
      this.container.appendChild(downloader)
      downloader.click()
      setTimeout(() => {
        this.container.removeChild(downloader)
      }, 100);
    }

    fileEvent() {
      this.fileInput.addEventListener('change', (event) => {
        const fileName = URL.createObjectURL(event.target.files[0])
        const img = new Image()
        img.addEventListener('load', (e) => {
          this.width = e.path[0].naturalWidth // 파일의 원래 너비
          this.height = e.path[0].naturalHeight
        })
        this.fileImage.setAttribute('src', fileName)
        img.setAttribute('src', fileName)
      })
    }
    
    drawEvent() {
      // getBoundingClientRect : 캔버스의 크기, 위치 가져옴
      const canvasX = this.canvas.getBoundingClientRect().left
      const canvasY = this.canvas.getBoundingClientRect().top
      // start, end 각각의 X, Y 좌표
      let sX, sY, eX, eY
      let drawStart = false

      this.canvas.addEventListener('mousedown', (e) => {
        // 정확히 (0,0)에서 시작하는 sX, sY 구하기
        sX = parseInt(e.clientX - canvasX, 10)  // clientX : 마우스의 X좌표
        sY = parseInt(e.clientY - canvasY, 10)
        drawStart = true
      })

      this.canvas.addEventListener('mousemove', (e) => {
        if (!drawStart) return
        // 마우스 움직이는 동안 eX, eY 계속 할당
        eX = parseInt(e.clientX - canvasX, 10)
        eY = parseInt(e.clientY - canvasY, 10)
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.ctx.strokeRect(sX, sY, eX - sX, eY - sY)
      })

      this.canvas.addEventListener('mouseup', () => {
        drawStart = false

        if (
          Math.abs(eX - sX) < this.minSize ||
          Math.abs(eY - sY) < this.minSize
        )
          return

        this.drawOutput(sX, sY, eX - sX, eY - sY)
      })
    }

    drawOutput(x, y, width, height) {
      this.targetImage.innerHTML = ''
      if (Math.abs(width) <= Math.abs(height)) {
        this.targetHeight = this.height
        this.targetWidth = (this.targetHeight * width) / height
      } else {
        this.targetWidth = this.width
        this.targetHeight = (this.targetWidth * height) / width
      }
      this.targetCanvas.width = this.targetWidth
      this.targetCanvas.height = this.targetHeight

      this.img.addEventListener('load', () => {
        const buffer = this.img.width / this.width
        this.sourceX = x * buffer
        this.sourceY = y * buffer
        this.sourceWidth = width * buffer
        this.sourceHeight = height * buffer
        this.targetCtx.drawImage(
          this.img,
          this.sourceX,
          this.sourceY,
          this.sourceWidth,
          this.sourceHeight,
          0,
          0,
          this.targetWidth,
          this.targetHeight
        )
      })
      this.img.src = this.fileImage.getAttribute('src')
      this.targetImage.appendChild(this.targetCanvas)
    }
  }

  new PhotoEditor()
})()
