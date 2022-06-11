'use strict';
//* Variables
let right = 10;
let score = 0;
let highscore = 0;
let counter = 0;
let myNumber = Math.trunc(Math.random() * 100) + 1;
let gameOn = true;
let isEnd = false;
let isStart = false;
let isStop = false;
let difficultyLevel = 'normal';
let playerName = '';
let highScoreList;
!sessionStorage.getItem('Guess My Number High Score') &&
  sessionStorage.setItem(
    'Guess My Number High Score',
    JSON.stringify([{ player: 'Unknown', score: 100, time: 100000 }])
  );

//* Basic Functions
const gameMessage = function (message) {
  document.querySelector('.message').textContent = message;
};
const gameRight = function (right) {
  document.querySelector('.right1').textContent = right;
};
const gameScore = function (tempScore) {
  document.querySelector('.score').textContent = tempScore;
};
const gameBetween = function (text) {
  document.querySelector('.between').textContent = text;
};

//* Get highscores from session storage

highScoreList = JSON.parse(
  sessionStorage.getItem('Guess My Number High Score')
);

//* Enter Game
document.querySelector('.enter-name').addEventListener('click', e => {
  gameOn = false;
  document.querySelector('#name').value
    ? (playerName = document.querySelector('#name').value)
    : (playerName = 'Unknown Player');
  document.querySelector('.main').classList.remove('d-none');
  document.querySelector('.buttons').classList.remove('d-none');
  document.querySelector('.enter').classList.add('d-none');

  document.querySelector('.start').play();
});

//* Adjust Background according to difficulty level
const adjustBackground = function (color) {
  document.querySelector('.left').classList.remove(`bg-success`);
  document.querySelector('.left').classList.remove(`bg-warning`);
  document.querySelector('.left').classList.remove(`bg-danger`);
  document.querySelector('.left').classList.add(`bg-${color}`);
  document.querySelector('.left').classList.add('bg-gradient');
};

//* Reset Defaults
const reset = function () {
  gameOn = false;
  right = 10;
  score = 0;
  counter = 0;
  isEnd = false;
  isStart = false;
  isStop = false;
  start = 1;
  end = 100;
  difficultyLevel = 'normal';
  myNumber = Math.trunc(Math.random() * 100) + 1;
  gameMessage('Start Guessing❓');
  gameRight(right);
  gameBetween('Between 1 and 100');
  calculateScore(score);
  gameScore(0);
  document.querySelector('.guess').value = '';
  adjustBackground('warning');
  document.querySelector('.start').play();
};

//* Update Hall Of Fame
const updateTable = function () {
  document.querySelector('tbody').innerHTML = '';
  let place = 0;
  highScoreList
    .filter(entry => entry.score < 30)
    .filter((_, i) => i < 10)
    .forEach(score => {
      const newScore = document.createElement('tr');
      newScore.classList.add('text-secondary');
      newScore.innerHTML = `<th scope="row">${++place}</th>
      <td>${score.player}</td>
      <td>${score.score}</td>
      <td>${score.time}</td>`;
      document.querySelector('tbody').append(newScore);
    });
};

//* Add Difficulty Level and Reset Button
document.querySelector('.buttons').addEventListener('click', e => {
  if (e.target.classList.contains('again')) {
    reset();
  } else if (!gameOn) {
    if (e.target.classList.contains('easy')) {
      right = 15;
      difficultyLevel = 'easy';
      gameRight(15);
      adjustBackground('success');
    } else if (e.target.classList.contains('normal')) {
      right = 10;
      difficultyLevel = 'normal';
      gameRight(10);
      adjustBackground('warning');
    } else if (e.target.classList.contains('hard')) {
      right = 5;
      difficultyLevel = 'hard';
      gameRight(5);
      adjustBackground('danger');
    }
  }
});

//* Between Calculator
let start = 1;
let end = 100;
const calculateBetween = function (number) {
  number >= 1 && number <= 100
    ? number > myNumber
      ? (end = number)
      : (start = number)
    : number;
  const text = `Between ${start} and ${end}`;
  gameBetween(text);
};

//* Check If Win
const isWin = function () {
  gameMessage('🥳 Correct Number');
  gameRight(right - 1);
  if (!isEnd) {
    !isStop ? (isStop = new Date().getTime()) : isStop;
    const tempScore = calculateScore(++counter);
    gameScore(tempScore);
    checkHighScore(tempScore);
    winCeramony();
    gameBetween('🎊🎊🎊Congrats🎊🎊🎊');
    isEnd = true;
  }
};

//* Calculate Score
const calculateScore = function (score) {
  if (difficultyLevel === 'hard') {
    return score * 1;
  } else if (difficultyLevel === 'normal') {
    return score * 2;
  } else if (difficultyLevel === 'easy') {
    return score * 3;
  }
};

//* Check Highscore
const checkHighScore = function (score) {
  let flag = false;
  const time = ((isStop - isStart) / 1000).toFixed(2);
  const highScoreEntry = { player: playerName, score: score, time: time };

  highScoreList.forEach((entry, i) => {
    if (highScoreEntry.score < entry.score) {
      highScoreList.splice(i, 0, highScoreEntry);
    } else if (
      highScoreEntry.score == entry.score &&
      highScoreEntry.time <= entry.time
    ) {
      highScoreList.splice(i, 0, highScoreEntry);
    }
  });

  saveHighScore(highScoreList.slice(0, 11));
  updateTable();
};

//* Win Ceramony
const winCeramony = function () {
  document.querySelector('.main').classList.add('d-none');
  document.querySelector('.buttons').classList.add('d-none');
  document.querySelector('.video').classList.remove('d-none');
  document.querySelector(`.win${Math.trunc(Math.random() * 3) + 1}`).play();
  document.querySelector('.video').play();
  document.querySelector(
    '.heading'
  ).innerHTML = `<i class="fa-solid fa-trophy text-warning"></i> WINNER <i class="fa-solid fa-trophy text-warning"></i>`;
};

const lostCeramony = function () {
  document.querySelector('.giphy').play();
  document.querySelector('.game-over').play();
  gameBetween(`😔 The correct number was ${myNumber}`);
  document.querySelector('.main').classList.add('d-none');
  document.querySelector('.buttons').classList.add('d-none');
  document.querySelector('.giphy').classList.remove('d-none');
  document.querySelector(
    '.heading'
  ).innerHTML = `<i class="fa-solid fa-explosion text-danger"></i></i> LOSER <i class="fa-solid fa-explosion text-danger"></i></i>`;
};

//* Saving Session Storage
const saveHighScore = function (list) {
  sessionStorage.setItem('Guess My Number High Score', JSON.stringify(list));
};

//* Play Game Check Button
document.querySelector('.check').addEventListener('click', e => {
  gameOn = true;
  !isStart ? (isStart = new Date().getTime()) : isStart;
  const guess = +document.querySelector('.guess').value;
  if (right > 1) {
    if (!guess) {
      gameMessage('❌ Only Number');
    } else if (guess === myNumber) isWin();
    else if (guess !== myNumber) {
      right--;
      gameMessage(guess > myNumber ? '👎 A Bit Lower ' : '👍 A Bit Higher ');
      guess > myNumber
        ? document.querySelector('.tap-up').play()
        : document.querySelector('.tap-down').play();
      gameRight(right);
      const tempScore = calculateScore(++counter);
      gameScore(tempScore);
      calculateBetween(guess);
    }
  } else {
    if (guess === myNumber) isWin();
    else {
      gameRight(0);
      calculateScore(0);
      gameScore(0);
      gameMessage('You Have Lost!');
      lostCeramony();
    }
  }
});

document.querySelector('.videos').addEventListener('click', e => {
  if (e.target.classList.contains('video')) {
    document.querySelector('.main').classList.remove('d-none');
    document.querySelector('.buttons').classList.remove('d-none');
    document.querySelector('.video').classList.add('d-none');
    document.querySelector('.heading').innerHTML = 'Guess My Number!';
  } else if (e.target.classList.contains('giphy')) {
    document.querySelector('.main').classList.remove('d-none');
    document.querySelector('.buttons').classList.remove('d-none');
    document.querySelector('.giphy').classList.add('d-none');
    document.querySelector('.heading').innerHTML = 'Guess My Number!';
  }
});

updateTable();
