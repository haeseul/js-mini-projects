;(function () {
  'use strict'

  const get = (target) => {
    return document.querySelector(target)
  }


  class Carousel {
    constructor(carouselElement) {
      this.carouselElement = carouselElement
      this.itemClassName = 'carousel_item'
      this.items = this.carouselElement.querySelectorAll('.carousel_item')

      this.totalItems = this.items.length // carousel 아이템 총 개수 (5개)
      this.current = 0    // 초기 아이템

      // 슬라이더가 동작하는 동안 네비 기능 막기 (움직이지 않는 false 상태일 때만 carousel 동작)
      this.isMoving = false
    }
    
    // Carousel 초기화
    initCarousel() {
      this.isMoving = false
      this.items[0].classList.add('active')
      this.items[1].classList.add('next')
      this.items[this.totalItems - 1].classList.add('prev')
    }

    // 동작하고 나서 500ms 뒤에 carousel 사용 가능
    disabledInteraction() {
      this.isMoving = true
      setTimeout(() => {
        this.isMoving = false
      }, 500);
    }

    setEventListener() {
      this.prevButton = this.carouselElement.querySelector('.carousel_button--prev')
      this.nextButton = this.carouselElement.querySelector('.carousel_button--next')

      this.prevButton.addEventListener('click', () => {this.movePrev()})
      this.nextButton.addEventListener('click', () => {this.moveNext()})
    }

    moveCarouselTo() {
      if (this.isMoving) return
      this.disabledInteraction()
      let prev = this.current - 1
      let next = this.current + 1

      if (this.current === 0) {
        prev = this.totalItems - 1
      } else if (this.current === this.totalItems - 1) {
        next = 0
      }

      for (let i=0; i<this.totalItems; i++) {
        if (i == this.current) {
          this.items[i].className = this.itemClassName + ' active'
        } else if (i == prev) {
          this.items[i].className = this.itemClassName + ' prev'
        } else if (i == next) {
          this.items[i].className = this.itemClassName + ' next'
        } else {
          this.items[i].className = this.itemClassName
        }
      }
    }

    moveNext() {
      if (this.isMoving) return
      if (this.current === this.totalItems - 1) {
        this.current = 0
      } else {
        this.current++
      }
      this.moveCarouselTo()
    }

    movePrev() {
      if (this.isMoving) return
      if (this.current === 0) {
        this.current = this.totalItems - 1
      } else {
        this.current--
      }
      this.moveCarouselTo()
    }
  }


  document.addEventListener('DOMContentLoaded', () => {
    const carouselElement = get('.carousel')
    const carousel = new Carousel(carouselElement)

    carousel.initCarousel() // Carousel 초기화
    carousel.setEventListener()
  })
})()
