// document represents
// value already exists....getElementById can return an object(HTML objec) access properties and functions....whatever returns grab the valule
//fetch returns a promise... we don't know how long it will take... a promise has a .then function with it
const apiKey = "0e838434e66ae361b7b597b1e5fb3a55";
let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
const searchHistoryElement = document.getElementById("searchHistory");
const forecastElement = document.getElementById("forecast");
const todayForecastElement = document.getElementById("today-forecast");

function refreshSearchHistory() {
  searchHistoryElement.innerHTML = "";
  searchHistory.forEach(e => {
    const node = document.createElement("p");
    node.innerText = e;
    searchHistoryElement.appendChild(node);
  });
}

refreshSearchHistory();

function addForecastCard(city, date, temp, wind, humidity, weather, icon) {
  let weatherIconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`
  let forecastCard = `
  <div class="card" style="color: #4B515D; border-radius: 35px;">
    <div class="card-body p-4">
        <div class="d-flex">
        <h6>${date}</h6>
        </div>
        <div class="d-flex flex-column text-center mt-5 mb-4">
        <h6 class="display-4 mb-0 font-weight-bold" style="color: #1C2331;"> ${temp}°F </h6>
        <span class="small" style="color: #868B94">${weather}</span>
        </div>

        <div class="d-flex align-items-center">
        <div class="flex-grow-1" style="font-size: 1rem;">
            <div><i class="fas fa-wind fa-fw" style="color: #868B94;"></i> <span class="ms-1"> ${wind} km/h
            </span></div>
            <div><i class="fas fa-tint fa-fw" style="color: #868B94;"></i> <span class="ms-1"> ${humidity}% </span>
            </div>
        </div>
        <div>
          <img src="${weatherIconUrl}">
        </div>
    </div>
  </div>`;

  return forecastCard;
}

function searchCity() {
  const city = document.getElementById("cityInput").value;
  fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
  )
  // http is unsecured....https is secured traffic
    .then((response) => response.json())
    .then((data) => {
      let location = data[0];
      let lat = location.lat;
      let lon = location.lon;

      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`
      )
        .then((response) => response.json())
        .then((data) => {
          todayForecastElement.innerHTML = "";
          let temp = data.main.temp;
          let humidity = data.main.humidity;
          let weather = data.weather[0].main;
          let wind = data.wind.speed;
          let date = data.dt_txt;
          let icon = data.weather[0].icon;
          const node = addForecastCard(city, "Today", temp, wind, humidity, weather, icon);
          todayForecastElement.innerHTML += node;
        })

      fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`
      )
        .then((response) => response.json())
        .then((data) => {
          let days = data.list.filter(e => e.dt_txt.includes("12:00:00"))
          console.log(days);

          if(!searchHistory.includes(city)) {
            searchHistory.push(city);
            refreshSearchHistory();
          }

          localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

          forecastElement.innerHTML = "";

          days.forEach(d => {
            let temp = d.main.temp;
            let humidity = d.main.humidity;
            let weather = d.weather[0].main;
            let wind = d.wind.speed;
            let date = d.dt_txt;
            let icon = d.weather[0].icon;
            const node = addForecastCard(city, date, temp, wind, humidity, weather, icon);
            forecastElement.innerHTML += node;
          })
        });
    });
}

//BELOW IS AN EXAMPLE OF API WORKED ON DURING TUTORING(NOTES)
//check to make sure city is already there......function.....

// function searchCity() {
//   const city = document.getElementById("cityInput").value;
// }
// // use hashtag for jquery...
// // .then is a promise bringing function
// //call back function
// //how to get information that we need

// fetch("https://pokeapi.co/api/v2/pokemon")
//   .then((tacocat) => {
//     console.log(tacocat);
//     return tacocat.json();
//   })
//   .then((jingle) => {
//     console.log(jingle);
//     var pokemons = jingle.results;
//     console.table(pokemons);
//     for (let i = 0; i < pokemons.length; i++) {
//       var body = document.querySelector("body");
//       //     body.innerHTML += `<h1>pokemon Number ${i +1}</h1><button class="pokemon"><a href=${pokemons[i].url}>${pokemons[i].name}</a></button>`
//       var button = document.createElement("button");
//       button.classList.add("pokemon");
//       button.innerText = pokemons[i].name;
//       body.append(button);
//     }
//   });

//   fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${"sacramento"}&appid=0e838434e66ae361b7b597b1e5fb3a55
//   `)
//     .then((responseData)
//     )