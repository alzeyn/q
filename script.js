// Год, на который возвращается ползунок
const START_YEAR = 1650;
 
// На сколько лет можно ошибиться, чтобы ответ засчитался
const TOLERANCE = 0;
 
const slider = document.getElementById("year-slider");
const yearText = document.getElementById("year-value");
 
let number = 0;     // номер текущего события
let viewer = null;  // панорама
let points = 0;     // баллы за текущее событие
let score = 0;      // сумма баллов


// Кнопка «Начать»
function start() {
  number = 0;
  score = 0;
  showEvent();
}


// Кнопка «Следующее событие»
function next() {
  score = score + points;
  number = number + 1;
  showEvent();
}
 
 
// Показываем событие
function showEvent() {
  // Если события закончились — экран завершения
  if (number >= EVENTS.length) {
    document.getElementById("game-screen").hidden = true;
    document.getElementById("finish-screen").hidden = false;
    document.getElementById("score").textContent = "Ваши баллы: " + score + " из " + EVENTS.length * 10;
    return;
  }
 
  document.getElementById("start-screen").hidden = true;
  document.getElementById("finish-screen").hidden = true;
  document.getElementById("game-screen").hidden = false;
  closeInfo();
 
  // Ползунок в начальное положение
  slider.value = START_YEAR;
  slider.disabled = false;
  yearText.textContent = START_YEAR;
 
  // Загружаем 360°-панораму
  if (viewer != null) {
    viewer.destroy();
  }
  viewer = pannellum.viewer("panorama", {
    type: "equirectangular",
    panorama: EVENTS[number].panorama,
    autoLoad: true,
    showControls: false
  });
}
 
 
// Ползунок: показываем выбранный год
function showYear() {
  yearText.textContent = slider.value;
}
 
 
// Кнопка «Проверить»
function check() {
  const event = EVENTS[number];
  const answer = Number(slider.value);
  const difference = Math.abs(answer - event.year);
 
  points = 10 - difference;
  if (points < 0) {
    points = 0;
  }
  slider.disabled = true; // после проверки год менять нельзя

  let html = "";

  if (difference <= TOLERANCE) {
    html += "<p class='right'>Правильно!</p>";
  } else {
    html += "<p class='wrong'>Неправильно. Разница в годах: " + difference + "</p>";
  }
  html += "<p class='answer'>Ваш ответ: " + answer + ". Правильный год: " + event.year + ". Баллы: " + points + " из 10</p>";
 
  // Название и описание
  html += "<h2>" + event.title + "</h2>";
  html += "<p>" + event.description + "</p>";
 
  // Референсы
  html += "<h3>Референсы</h3>";
  html += "<p>" + event.references + "</p>";

  // Фото референсов со ссылками
  for (let i = 0; i < event.photos.length; i++) {
    const photo = event.photos[i];
    if (photo.image != "") {
      html += "<img src='" + photo.image + "'>";
    }
    html += "<p>" + photo.text + "</p>";
    if (photo.link != "") {
      html += "<a href='" + photo.link + "' target='_blank'>Источник ↗</a>";
    }
  }

  document.getElementById("info").innerHTML = html;
  document.getElementById("year-bar").hidden = true;
  document.getElementById("info-panel").hidden = false;
  document.getElementById("info-panel").scrollTop = 0; // окно открывается с начала
}
 
 
// Кнопка «×»
function closeInfo() {
  document.getElementById("info-panel").hidden = true;
  document.getElementById("year-bar").hidden = false;
}