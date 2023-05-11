'use strict';

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputTemp = document.querySelector('.form__input--temp');
const inputClimb = document.querySelector('.form__input--climb');

let map, mapEvent;

class Workout {
  date = new Date();
  id = (Date.now() + '').slice(-10);

  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance; // km
    this.duration = duration; // min
  }

  _setDescription() {
    this.type === 'running'
      ? (this.description = `Пробежка ${new Intl.DateTimeFormat('ru-RU').format(
          this.date
        )}`)
      : (this.description = `Велотренировка${new Intl.DateTimeFormat(
          'ru-RU'
        ).format(this.date)}`);
  }
}

class Running extends Workout {
  type = 'running';

  constructor(coords, distance, duration, temp) {
    super(coords, distance, duration);
    this.temp = temp;
    this.calculatePace();
    this._setDescription();
  }

  calculatePace() {
    this.pace = this.duration / this.distance;
  }
}

class Cycling extends Workout {
  type = 'cycling';

  constructor(coords, distance, duration, climb) {
    super(coords, distance, duration);
    this.climb = climb;
    this.calculateSpeed();
    this._setDescription();
  }
  calculateSpeed() {
    this.speed = this.distance / this.duration;
  }
}

// const running = new Running([50, 39], 7, 40, 170);
// const cycling = new Cycling([50, 39], 37, 80, 370);
// console.log(cycling);

class App {
  #map;
  #mapEvent;
  #workouts = [];
  constructor() {
    this._getPosition();

    this._getLocalStorageData();

    form.addEventListener('submit', this._newWorkout.bind(this));

    inputType.addEventListener('change', this._toggleClimbField.bind(this));

    containerWorkouts.addEventListener('click', this._moveToWorkout.bind(this));
  }

  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert('Невозможно получить ваше местоположение.');
        }
      );
    }
  }

  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    // console.log(`https://www.google.com/maps/@${latitude},${longitude},11z`);
    const coords = [latitude, longitude];

    this.#map = L.map('map').setView(coords, 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // Обработка клика на карте
    this.#map.on('click', this._showForm.bind(this));

    this.#workouts.forEach(workout => {
      this._displayWorkout(workout);
    });
  }

  _showForm(e) {
    this.#mapEvent = e;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _hideForm() {
    inputDistance.value =
      inputDuration.value =
      inputClimb.value =
      inputTemp.value =
        '';
    form.classList.add('hidden');
  }

  _toggleClimbField() {
    inputClimb.closest('.form__row').classList.toggle('form__row--hidden');
    inputTemp.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(e) {
    const areNumbers = (...numbers) =>
      numbers.every(num => Number.isFinite(num));

    const areNumbersPositive = (...numbers) => numbers.every(num => num > 0);

    const { lat, lng } = this.#mapEvent.latlng;

    let workout;

    e.preventDefault();

    // Получить данные из формы
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;

    // Если тренеровка беговая создать объект running
    if (type === 'running') {
      const temp = +inputTemp.value;

      //  Проверка валидности данных
      if (
        !areNumbers(distance, duration, temp) ||
        !areNumbersPositive(distance, duration, temp)
      )
        return alert('Введите положительное число!');

      workout = new Running([lat, lng], distance, duration, temp);
    }

    // Если тренеровка вело создать объект cycling
    if (type === 'cycling') {
      const climb = +inputClimb.value;

      //  Проверка валидности данных
      if (
        !areNumbers(distance, duration, climb) ||
        !areNumbersPositive(distance, duration)
      )
        return alert('Введите положительное число!');

      workout = new Cycling([lat, lng], distance, duration, climb);
    }

    // Добавить новый объект в массив тренеровок

    this.#workouts.push(workout);
    // console.log(workout);
    //  отобразить тренировку на карте
    this._displayWorkout(workout);

    //  Отобразить тренировку в списке
    this._displayWorkoutOnSideBar(workout);

    // Спрятать форму тренировки

    this._hideForm();

    //Добавить все тренировки в локальное хранилище

    this._addWorkoutsToLocalStorage();
  }

  _displayWorkout(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 200,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(
        `${workout.type === 'running' ? '🏃' : '🚵‍♂️'} ${workout.description}`
      )
      .openPopup();
  }

  _displayWorkoutOnSideBar(workout) {
    let html = `
  <li class="workout workout--${workout.type}" data-id="${workout.id}">
    <h2 class="workout__title">${workout.description}</h2>
    <div class="workout__details">
      <span class="workout__icon">${
        workout.type === 'running' ? '🏃' : '🚵‍♂️'
      }</span>
      <span class="workout__value">${workout.distance}</span>
      <span class="workout__unit">км</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">⏱</span>
      <span class="workout__value">${workout.duration}</span>
      <span class="workout__unit">мин</span>
    </div>`;

    if (workout.type === 'running') {
      html += ` 
    <div class="workout__details">
     <span class="workout__icon">📏⏱</span>
     <span class="workout__value">${workout.pace.toFixed(1)}</span>
     <span class="workout__unit">м/мин</span>
    </div>
    <div class="workout__details">
     <span class="workout__icon">👟⏱</span>
     <span class="workout__value">${workout.temp}</span>
     <span class="workout__unit">шаг/мин</span>
    </div>
</li>`;
    }
    if (workout.type === 'cyclig') {
      html += ` 
      <div class="workout__details">
       <span class="workout__icon">📏⏱</span>
       <span class="workout__value">${workout.speedtoFixed(1)}</span>
       <span class="workout__unit">км/ч</span>
    </div>
    <div class="workout__details">
       <span class="workout__icon">🏔</span>
       <span class="workout__value">${workout.climb}</span>
       <span class="workout__unit">м</span>
    </div>
</li>`;
    }

    form.insertAdjacentHTML('afterend', html);
  }

  _moveToWorkout(e) {
    const workoutElement = e.target.closest('.workout');
    if (!workoutElement) return;

    const workout = this.#workouts.find(
      item => item.id === workoutElement.dataset.id
    );

    this.#map.setView(workout.coords, 13, {
      animate: true,
      pan: {
        duration: 1,
      },
    });
  }

  _addWorkoutsToLocalStorage() {
    localStorage.setItem('workouts', JSON.stringify(this.#workouts));
  }
  _getLocalStorageData() {
    const data = JSON.parse(localStorage.getItem('workouts'));

    if (!data) return;

    this.#workouts = data;

    this.#workouts.forEach(workout => {
      this._displayWorkoutOnSideBar(workout);
    });
  }

  //   reset() {
  //     localStorage.removeItem('workouts');
  //     location.reload();
  //   }
}

const app = new App();

// app.reset();
