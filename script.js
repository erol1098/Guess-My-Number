'use strict';
let score = 10;
let highscore = 0;
let myNumber = Math.trunc(Math.random() * 100) + 1;
let gameOn = false;

const gameMessage = function (message) {
  document.querySelector('.message').textContent = message;
};
const gameScore = function (score) {
  document.querySelector('.score').textContent = score;
};
const gameNumber = function (number) {
  //   document.querySelector('.number').textContent = number;
};

//* Adjust Background according to difficulty level
const adjustBackground = function (color) {
  document.querySelector('.left').classList.remove(`bg-success`);
  document.querySelector('.left').classList.remove(`bg-warning`);
  document.querySelector('.left').classList.remove(`bg-danger`);
  document.querySelector('.left').classList.add(`bg-${color}`);
  document.querySelector('.left').classList.add('bg-gradient');
};

//* Play Game Check Button
document.querySelector('.check').addEventListener('click', e => {
  gameOn = true;
  const guess = +document.querySelector('.guess').value;
  if (score > 1) {
    if (!guess) {
      gameMessage('🛑 Only Number');
    } else if (guess === myNumber) {
      gameMessage('🎉 Correct Number');
      gameScore(score - 1);
      if (score > highscore) {
        document.querySelector('.highscore').textContent = highscore = score;
      }
      gameNumber(myNumber);
      document.querySelector('body').style.backgroundColor = '#60b347';
    } else if (guess !== myNumber) {
      score--;
      gameMessage(guess > myNumber ? '👎 A Bit Lower ' : '👍 A Bit Higher ');
      gameScore(score);
    }
  } else {
    gameNumber(myNumber);
    gameScore(0);
    gameMessage('You Have Lost!');
  }
});

//* Reset
document.querySelector('.again').addEventListener('click', e => {
  gameOn = false;
  score = 10;
  myNumber = Math.trunc(Math.random() * 100) + 1;
  gameMessage('Start guessing');
  gameNumber('?');
  gameScore(10);
  document.querySelector('.guess').value = '';
  document.querySelector('body').style.backgroundColor = '#fff';
});

//* Add Difficulty Level
document.querySelector('.buttons').addEventListener('click', e => {
  if (!gameOn) {
  }
  if (e.target.classList.contains('easy')) {
    score = 15;
    gameScore(15);
    adjustBackground('success');
  } else if (e.target.classList.contains('normal')) {
    score = 10;
    gameScore(10);
    adjustBackground('warning');
  } else if (e.target.classList.contains('hard')) {
    score = 5;
    gameScore(5);
    adjustBackground('danger');
  }
});
