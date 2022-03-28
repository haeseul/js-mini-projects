;(function () {
  'use strict'

  const get = (target) => {
    return document.querySelector(target)
  }

  let page = 1
  const limit = 10  // 모든 데이터를 가져오지 않도록 limit 걸어주기
  const end = 100   // 총 데이터 개수
  let total = 10  // 지금까지 가져온 데이터 개수

  const $posts = get('.posts')
  const $loader = get('.loader')

  const getPost = async () => {
    const API_URL = `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${limit}`
    const response = await fetch(API_URL)
    if (!response.ok) {
      throw new Error('에러')
    }
    return await response.json()
  }


  const showPosts = (posts) => {
    posts.forEach((post) => {
      const $post = document.createElement('div')
      $post.classList.add('post')
      $post.innerHTML = `
        <div class = "header">
          <div class = "id">${post.id}</div>
          <div class = "title">${post.title}</div>
        </div>
        <div class = "body">
          ${post.body}
        </div>
      `
    $posts.appendChild($post)
    });
  }


  const showLoader = () => {
    $loader.classList.add('show')
  }
  
  
  const hideLoader = () => {
    $loader.classList.remove('show')
  }


  const loadPost = async () => {
    // 로딩 엘리먼트를 보여줌
    showLoader()
    try {
      const response = await getPost()
      showPosts(response)
    } catch (error) {
      console.error(error)
    } finally {
      // 로딩 엘리먼트 사라지게
      hideLoader()
    }
  }


  const onScroll = () => {
    const {scrollTop, scrollHeight, clientHeight} = document.documentElement

    if (total == end) {
      window.removeEventListener('scroll', onScroll)
      return
    }

    if (scrollTop + clientHeight >= scrollHeight - 5) {
      page++
      total += 10
      loadPost()
    }
  }


  window.addEventListener('DOMContentLoaded', () => {
    loadPost()

    // 스크롤 끝 감지
    window.addEventListener('scroll', onScroll)
  })
})()
