;( () => {
  'use strict'

  const get = (target) => document.querySelector(target)

  const init = () => {
    get('form').addEventListener('submit', (event) => {
      playGame(event)
    })
    setPassword()
  }

  const baseball = {
    limit: 10,
    digit: 4,
    trial: 0,
    end: false, 
    $question: get('.ball_question'),
    $answer: get('.ball_answer'),
    $input: get('.ball_input'),
  }

  // object destructing : 변수들을 전역에서 사용 가능하도록 함
  const { limit, digit, $question, $answer, $input } = baseball  //const : 재할당 불가
  let { trial, end } = baseball   // let : 가변값


  // 패스워드(정답) 지정
  const setPassword = () => {
    const gameLimit = Array(limit).fill(false)  // limit개의 array를 false로 채워서 생성
    let password = ''     // 패스워드 초기화

    // 4자리 수가 찰 때까지 반복
    while (password.length < digit) {
      const random = parseInt(Math.random() * 10, 10)

      // gameLimit[random]에 원래는 false가 들어가있지만 true인 경우 pass (중복숫자 피하기)
      if (gameLimit[random]) {continue}
      password += random
      gameLimit[random] = true
    }
    baseball.password = password
    console.log(password)
  }


  // 시도를 했을 때 number: 내가 입력한 숫자, hint: 현재 어떤 상황?
  const onPlayed = (number, hint) => {
    return `<em>${trial}차 시도</em>: ${number}, ${hint}`
  }


  // 번호가 같은가?
  const isCorrect = (number, answer) => {
    return number === answer
  }

  // 중복번호가 있는가?
  const isDuplicate = (number) => {
    // new Set() : 하나의 Set 내의 값은 유일해야 함 -> 중복 확인에 사용
    return [...new Set(number.split(''))].length !== digit
  }


  // 스트라이크 카운트
  const getStrikes = (number, answer) => {
    let strike = 0
    const nums = number.split('') // 4자리 number를 분리해 배열로 생성

    nums.map((digit, index) => {  // map으로 새로운 배열 생성
      if (digit === answer[index]) {
        strike++
      }
    })
    return strike
  }

  // 볼 카운트
  const getBalls = (number, answer) => {
    let ball = 0
    const nums = number.split('')
    const gameLimit = Array(limit).fill(false)

    answer.split('').map((num) => {
      gameLimit[num] = true   // 정답인 숫자가 있다면 true
    })
    
    nums.map((num, index) => {
      // 자리에 해당하는 값은 아니지만 && 정답인 숫자가 있다
      if (answer[index] !== num && !!gameLimit[num]) {
        ball++
      }
    })
    return ball
  }

  // 시도 결과
  const getResults = (number, answer) => {
    if (isCorrect(number, answer)) {
      end = true
      $answer.innerHTML =  baseball.password
      return '홈런!!'
    }

    const stirkes = getStrikes(number, answer)
    const balls = getBalls(number, answer)

    return 'STRIKE: ' + stirkes + ', BALL: ' + balls
  }


  // 게임 플레이
  const playGame = (event) => {
    event.preventDefault()

    if (!!end) {  // end라면
      return
    }

    const inputNumber = $input.value
    const {password} = baseball

    if (inputNumber.length !== digit) {
      alert(`${digit}자리 숫자를 입력해주세요.`)
    } else if (isDuplicate(inputNumber)) {
      alert('중복 숫자가 있습니다.')
    } else {
      trial++
      const result = onPlayed(inputNumber, getResults(inputNumber, password))
      $question.innerHTML += `<span>${result}</span>`

      if (limit <= trial && !isCorrect(inputNumber, password)) {
        alert('쓰리아웃!')
        end = true
        $answer.innerHTML = password
      }
    }
    $input.value=''
    $input.focus()
  }

  init()
})()
