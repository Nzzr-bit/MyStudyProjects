'use strict';

let secretNumber = Math.trunc(Math.random() * 20) + 1;
// document.querySelector('.question').textContent = secretNumber;
let score = 20;
const guessMessageAlert = message =>
  (document.querySelector('.guess-message').textContent = message);

document.querySelector('.check').addEventListener('click', function () {
  const guessingNumber = Number(document.querySelector('.number-input').value);
  console.log(guessingNumber, typeof guessingNumber);
  if (!guessingNumber) {
    guessMessageAlert('Введите число!');
  }
  // Игрок победил
  else if (guessingNumber === secretNumber) {
    guessMessageAlert('Правильно!');
    document.querySelector('body').style.backgroundColor = 'rgb(3, 156, 11)';
    document.querySelector('.question').textContent = secretNumber;
    document.querySelector('.question').style.width = '50rem';
    if (score > Number(document.querySelector('.highscore').textContent)) {
      document.querySelector('.highscore').textContent = score;
    }
  }
  // Игрок ошибся
  else if (guessingNumber != secretNumber) {
    if (score > 1) {
      guessMessageAlert(
        guessingNumber > secretNumber ? 'Слишком много!' : 'Слишком мало!'
      );
      score--;
      document.querySelector('.score').textContent = score;
    } else {
      guessMessageAlert('Game Over');
      document.querySelector('.score').textContent = 0;
      document.querySelector('body').style.backgroundColor = 'rgb(176, 2, 12)';
    }
  }
});

// Сначала

document.querySelector('.again').addEventListener('click', function () {
  score = 20;
  secretNumber = Math.trunc(Math.random() * 20) + 1;
  document.querySelector('.score').textContent = score;
  document.querySelector('.number-input').value = '';

  guessMessageAlert('Начни угадывать');
  document.querySelector('body').style.backgroundColor = 'rgb(0, 0, 0)';
  document.querySelector('.question').textContent = '???';
  document.querySelector('.question').style.width = '25rem';
});
