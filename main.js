'use strict';

const wallySize = 90;
const wallyCount = 1;
const gameDuration = 5;

const field = document.querySelector('.game-field');
const fieldRect = field.getBoundingClientRect();
const gameBtn = document.querySelector('.game-button');
const gameTimer = document.querySelector('.game-timer');
const popUp = document.querySelector('.pop-up');
const restartBtn = document.querySelector('.pop-up-refresh');
const popUpMessage = document.querySelector('.pop-up-message');

const wallySound = new Audio('./sound/wally_pull.mp3');
const bgSound = new Audio('./sound/bg.mp3');
const winSound = new Audio('./sound/game_win.mp3');
const loseSound = new Audio('./sound/lose.mp3');
const alertSound = new Audio('./sound/alert.wav');

let started = false;
let score = 0;
let timer = undefined;

field.addEventListener('click', onFieldClick);

gameBtn.addEventListener('click', () => {
  if (started) {
    stopGame();
  } else {
    startGame();
  }
  // started = !started;
});

restartBtn.addEventListener('click', () => {
  startGame();
  hidePopUp();
});

function startGame() {
  started = true;
  initGame();
  showStopButton();
  showTimer();
  startTimer();
  playSound(bgSound);
}
function stopGame() {
  started = false;
  clearInterval(timer);
  hideGameButton();
  // stopTimer();
  playSound(alertSound);
  stopSound(bgSound);
  showPopUpWithText('try again??');
}
function finishGame(win) {
  started = false;
  hideGameButton();
  if (win) {
    playSound(winSound);
  } else {
    const wally = document.querySelector('.wally');
    wally.classList.add('wally-border');
    playSound(loseSound);
  }
  stopTimer();
  stopSound(bgSound);
  showPopUpWithText(win ? '🎉YOU WIN🎉' : 'YOU LOSE😨');
}

function showStopButton() {
  const icon = gameBtn.querySelector('.fa-regular');
  icon.classList.add('fa-circle-stop');
  icon.classList.remove('fa-circle-play');
  gameBtn.style.visibility = 'visible';
}
function hideGameButton() {
  gameBtn.style.visibility = 'hidden';
}
function showTimer() {
  gameTimer.style.visibility = 'visible';
}
function startTimer() {
  let remainingTimeSec = gameDuration;
  updateTimer(remainingTimeSec);
  timer = setInterval(() => {
    if (remainingTimeSec <= 0) {
      clearInterval(timer);
      finishGame(score == wallyCount);
      return;
    }
    updateTimer(--remainingTimeSec);
  }, 1000);
}
function stopTimer() {
  clearInterval(timer);
  // timer = undefined;
}
function updateTimer(time) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  gameTimer.innerHTML = `${minutes} : ${seconds}`;
}
function showPopUpWithText(text) {
  popUpMessage.innerHTML = text;
  popUp.classList.remove('pop-up-hide');
}
function onFieldClick(event) {
  // if (!started) {
  //   return;
  // }
  const target = event.target;
  if (target.matches('.wally')) {
    const wally = document.querySelector('.wally');
    wally.classList.add('wally-border');
    score++;
    playSound(wallySound);
    if (score === wallyCount) {
      stopTimer();
      finishGame(true);
    }
  }
}
function playSound(sound) {
  sound.currentTime = 0;
  sound.play(sound);
}
function stopSound(sound) {
  sound.pause();
}
function hidePopUp() {
  popUp.classList.add('pop-up-hide');
}

function initGame() {
  score = 0;
  field.innerHTML = '';
  // console.log(fieldRect);
  addItem('wally', 1, 'img/wally.png');
}

function addItem(classname, count, imgPath) {
  const x1 = 0;
  const y1 = 0;
  const x2 = fieldRect.width;
  const y2 = fieldRect.height - wallySize;
  for (let i = 0; i < count; i++) {
    const item = document.createElement('img');
    item.setAttribute('class', classname);
    item.setAttribute('src', imgPath);
    item.style.position = 'absolute';
    const x = randomNumber(x1, x2);
    const y = randomNumber(y1, y2);
    item.style.left = `${x}px`;
    item.style.top = `${y}px`;
    item.style.width = '40px';
    // item.style.backgroundColor = 'white';
    field.appendChild(item);
  }
  function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
  }
}
