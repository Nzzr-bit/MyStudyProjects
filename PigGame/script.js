'use strict';
// Обозначение элементов
const score0Element = document.getElementById('score--0');
const score1Element = document.getElementById('score--1');
const current0Element = document.getElementById('current--0');
const current1Element = document.getElementById('current--1');
const diceElement = document.querySelector('.dice');
const btnNew = document.querySelector('.btn--new');
const btnRoll = document.querySelector('.btn--roll');
const btnHold = document.querySelector('.btn--hold');
const player0Element = document.querySelector('.player--0');
const player1Element = document.querySelector('.player--1');

// Настройки начала игры
score0Element.textContent = 0;
score1Element.textContent = 0;
diceElement.classList.add('hidden');

const totalScores = [0, 0];
let currentScore = 0;
let activePlayer = 0;
let isPlaying = true;
const switchActivePlayer = function () {
  currentScore = 0;
  document.getElementById(`current--${activePlayer}`).textContent =
    currentScore;
  activePlayer = activePlayer === 0 ? 1 : 0;
  player0Element.classList.toggle('player--active');
  player1Element.classList.toggle('player--active');
};

// Roll
btnRoll.addEventListener('click', function () {
  if (isPlaying) {
    // 1.Генерация рандомного числа
    const diceNumber = Math.trunc(Math.random() * 6) + 1;

    // 2.Отображение числа на экране
    diceElement.classList.remove('hidden');
    diceElement.src = `dice${diceNumber}.png`;

    // 3.Если число равно 1, то сменить игрока
    if (diceNumber !== 1) {
      currentScore += diceNumber;
      document.getElementById(`current--${activePlayer}`).textContent =
        currentScore;
    } else {
      switchActivePlayer();
    }
  }
});

// Оставить очки
btnHold.addEventListener('click', function () {
  //Добавить очки
  totalScores[activePlayer] += currentScore;
  document.getElementById(`score--${activePlayer}`).textContent =
    totalScores[activePlayer];

  //Проверить победил ли игрок
  if (totalScores[activePlayer] >= 100) {
    isPlaying = false;
    document
      .querySelector(`.player--${activePlayer}`)
      .classList.add('player--winner');

    document
      .querySelector(`.player--${activePlayer}`)
      .classList.remove('player--active');
  } else {
    switchActivePlayer();
  }
});

btnNew.addEventListener('click', function () {
  diceElement.classList.add('hidden');

  const totalScores = [0, 0];
  let currentScore = 0;
  let activePlayer = 0;
  let isPlaying = true;

  score0Element.textContent = 0;
  score1Element.textContent = 0;
  current0Element.textContent = 0;
  current1Element.textContent = 0;
  player0Element.classList.remove('player--winner');
  player1Element.classList.remove('player--winner');
  player0Element.classList.remove('player--active');
  player1Element.classList.remove('player--active');
  player0Element.classList.add('player--active');
});
