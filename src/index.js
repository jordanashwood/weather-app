//Get Day and Time -- working
function formatDate(date) {
  var hours = date.getHours();

  // if (hours > 14) {
  //   console.log("it's night.");

  //   let backgroundImage = document.querySelector("body");
  //   backgroundImage.setAttribute(
  //     "style",
  //     "background: url(img/night-weather-bg.png)"
  //   );
  //   backgroundImage.setAttribute("style", "background-repeat: no-repeat");
  //   backgroundImage.setAttribute("style", "background-size: cover");
  //   backgroundImage.setAttribute("style", "background-attachment: fixed");
  // }

  if (hours < 10) {
    hours = `0${hours}`;
  }

  var minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  var dayIndex = date.getDay();
  var days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  var day = days[dayIndex];
  return `${day} ${hours}:${minutes}`;
}
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

//Weather Display
function displayWeather(response) {
  document.querySelector("#city-name").innerHTML = response.data.name;
  document.querySelector("#temperature").innerHTML =
    Math.round(response.data.main.temp) + "°";
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#weather-description").innerHTML =
    response.data.weather[0].main;
  getForecast(response.data.coord);
  let iconElement = document.querySelector("#weather-icon");
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
}

//Changes icons
function changeIcon(response) {
  let icon = document.querySelector("#weather-icon");
  icon.setAttribute("src", response.data.condition.icon_url);
  icon.setAttribute("alt", response.data.condition.icon);
}
//Searches for city
function searchCity(city) {
  let apiKey = "a969311cfcbb4a83dfad2cf7478397f9";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(displayWeather);
}
function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#search-city").value;
  searchCity(city);
}
function searchLocation(position) {
  let apiKey = "a969311cfcbb4a83dfad2cf7478397f9";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=imperial`;

  axios.get(apiUrl).then(displayWeather);
}
//Geolocator
function getGeoLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}
//Celsius and Fahrenheit Converter -- active class not working
function toCelsius() {
  if (isFahrenheit) {
    // Convert Fahrenheit to Celsius
    const celsiusTemp =
      ((parseFloat(temperatureSpan.textContent) - 32) * 5) / 9;
    temperatureSpan.textContent = `${Math.round(celsiusTemp)}°`;

    const celsiusButton = document.getElementById("celsius");
    const fahrenheitButton = document.getElementById("fahrenheit");
    fahrenheitButton.classList.remove("active");
    celsiusButton.classList.add("active");
    isFahrenheit = false;
  }
}
function toFahrenheit() {
  // Convert Celsius to Fahrenheit
  if (isFahrenheit === false) {
    const fahrenheitTemp =
      (parseFloat(temperatureSpan.textContent) * 9) / 5 + 32;
    temperatureSpan.textContent = `${Math.round(fahrenheitTemp)}°`;

    const celsiusButton = document.querySelector("#celsius");
    const fahrenheitButton = document.getElementById("fahrenheit");
    fahrenheitButton.classList.add("active");
    celsiusButton.classList.remove("active");
    isFahrenheit = true;
  }
}
//Update Forecast Days
function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `
      <div class="day col">
      <div class="card-body">
            <div class="forecast-date">${formatDay(forecastDay.dt)}</div>
            <img
              src="https://openweathermap.org/img/wn/${
                forecastDay.weather[0].icon
              }@2x.png"
              width="70"
            />
            <div class="forecast-temps">
              <span class="forecast-high-temp">${Math.round(
                forecastDay.temp.max
              )}°F</span>/
              <span class="forecast-low-temp">${Math.round(
                forecastDay.temp.min
              )}°F</span>
            </div>
          </div>
          </div>
          `;
    }
  });

  forecastHTML += `</div>`;
  forecastElement.innerHTML = forecastHTML;
}
function getForecast(coordinates) {
  let apiKey = "a969311cfcbb4a83dfad2cf7478397f9";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=imperial`;

  axios.get(apiUrl).then(displayForecast);
}

searchCity("Charleston");

var dateElement = document.querySelector("#date");
var currentTime = new Date();
dateElement.innerHTML = formatDate(currentTime);

let searchForm = document.querySelector("#city-search-form");
searchForm.addEventListener("submit", handleSubmit);

let currentLocationButton = document.querySelector("#location-button");
currentLocationButton.addEventListener("click", getGeoLocation);

let isFahrenheit = true; // variable to keep track of the current unit
const temperatureSpan = document.getElementById("temperature");

const fahrenheitButton = document.getElementById("fahrenheit");
fahrenheitButton.addEventListener("click", toFahrenheit);

const celsiusButton = document.getElementById("celsius");
celsiusButton.addEventListener("click", toCelsius);
