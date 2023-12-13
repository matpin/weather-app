let bodyElement = document.body;
let date = document.querySelector(".dateContainer");
let searchBar = document.querySelector(".searchBar");
let deleteBtn = document.querySelector(".delete");
let searchBtn = document.querySelector(".searchBtn");
let loadingContainer = document.querySelector(".loadingClouds");
let tempInner = document.querySelector(".tempContainerInner");
let locationName = document.querySelector(".locationWeather");
let weatherIcon = document.querySelector(".imgContainer");
let temperature = document.querySelector(".temperature");
let celsiusTemp = document.querySelector(".celsiusTemp");
let fahrenheitTemp = document.querySelector(".fahrenheitTemp");
let weather = document.querySelector(".weather");
let feelsLike = document.querySelector(".feelsLike");
let weatherInner = document.querySelector(".weatherContainerInner");
let humidity = document.querySelector(".humidity");
let wind = document.querySelector(".wind");
let forecastInner = document.querySelector(".forecastInner");
let forecastDay1 = document.querySelector(".forecastDay1");
let forecastIcon1 = document.querySelector(".forecastIcon1");
let forecastTemp1 = document.querySelector(".forecastTemp1");
let forecastDay2 = document.querySelector(".forecastDay2");
let forecastIcon2 = document.querySelector(".forecastIcon2");
let forecastTemp2 = document.querySelector(".forecastTemp2");
let forecastDay3 = document.querySelector(".forecastDay3");
let forecastIcon3 = document.querySelector(".forecastIcon3");
let forecastTemp3 = document.querySelector(".forecastTemp3");

let weatherLocation = "";
let weatherLocationName;
let englishName;
let temp;
let weatherFeelsLike;
let firstDay;
let secondDay;
let thirdDay;
let forecastTempDay1;
let forecastTempDay2;
let forecastTempDay3;
let weatherCondition;

defaultBackground();

if ("geolocation" in navigator) {
navigator.geolocation.getCurrentPosition((position) => {
    // console.log(position.coords.latitude, position.coords.longitude);
    fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&limit=5&appid=ef1de1bd06df7847861fb57bf679a0ae`
    )
    .then((response => response.json()))
    .then((data) => {
        console.log(data)
        englishName = data[0].local_names.en;
        weatherLocation = `${data[0].local_names.ascii}, ${data[0].country}`;
        fetchData();
    })
    });
} else {
console.log("error");
}

showLoading(false);

searchBar.addEventListener("input", (e) => {
    weatherLocation = e.target.value;

    if(weatherLocation.length >= 1) {
        deleteBtn.removeAttribute("hidden");
    } else {
        deleteBtn.setAttribute("hidden", true);
    }
});

deleteBtn.addEventListener("click", () => {
    searchBar.value = "";
    weatherLocation = "";
    
    if(weatherLocation.length >= 1) {
        deleteBtn.removeAttribute("hidden");
    } else {
        deleteBtn.setAttribute("hidden", true);
    }
});

searchBar.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        fetchData();
    }
});

celsiusTemp.addEventListener("click", celsiusTemperature);

fahrenheitTemp.addEventListener("click", fahrenheitTemperature);

searchBtn.addEventListener("click", fetchData);

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
} 

function fetchData() {
    showLoading(true);
    delay(2000).then (() => {
        fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${weatherLocation}&appid=ef1de1bd06df7847861fb57bf679a0ae`
        )   
            .then((response) => response.json())
            .then((data) => {
                console.log(data);

                renderBackground(data.weather[0].main);

                let windSpeed = data.wind.speed;

                if (data.name === "") {
                    weatherLocationName = englishName;
                } else {
                    weatherLocationName = data.name;
                }

                renderWeatherInfos(weatherLocationName, data.weather[0].icon, data.weather[0].main, data.main.humidity, windSpeed);

                temp = data.main.temp;
                weatherFeelsLike = data.main.feels_like;

                celsiusTemperature();
                
                resetColors();
    
                temperatureChange();
    
                return fetch(
                    `https://api.openweathermap.org/data/2.5/forecast?q=${weatherLocation}&appid=ef1de1bd06df7847861fb57bf679a0ae`
                )
            })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);

                let forecastWeather1 = {
                    day: data.list[9].dt,
                    icon: data.list[9].weather[0].icon,
                    temperature: data.list[9].main.temp
                }
                let forecastWeather2 = {
                    day: data.list[17].dt,
                    icon: data.list[17].weather[0].icon,
                    temperature: data.list[17].main.temp
                }
                let forecastWeather3 = {
                    day: data.list[25].dt,
                    icon: data.list[25].weather[0].icon,
                    temperature: data.list[25].main.temp
                }
                renderForecast(forecastWeather1, forecastWeather2, forecastWeather3);

                celsiusTemperature();

                showLoading(false);
            })
            .catch((err) => {
                console.log(err)
                alert("Invalid location");
                showLoading(false);
            });
    }) 
    
}

//-----------------------Render temperature---------------------------
function renderWeatherInfos(placeName, icon, weatherType, weatherHumidity, weatherWind) {
    locationName.innerHTML = placeName;
    weatherIcon.innerHTML = `<img src="https://openweathermap.org/img/wn/${icon}@4x.png" alt="">`;

    weather.innerHTML = weatherType;
    humidity.innerHTML = `<i class="fa-solid fa-droplet"></i> &nbsp;&nbsp; ${weatherHumidity} %`;
    wind.innerHTML = `<i class="fa-solid fa-wind"></i> &nbsp; ${msToKmh(weatherWind).toFixed()} km\\h`;

    if (weatherType === "Thunderstorm") {
        weather.style.fontSize = "2.8em";
    } else {
        weather.style.fontSize = "4.8em";
    }
} 

//---------------------------Render forecast-----------------------------
function renderForecast(forecastWeather1, forecastWeather2, forecastWeather3) {
    const justDay = { weekday: "short" };

    firstDay = new Date((forecastWeather1.day) * 1000);
    let dayShort1 = new Intl.DateTimeFormat("en-US", justDay).format(firstDay);
    forecastDay1.innerHTML = dayShort1;

    secondDay = new Date((forecastWeather2.day) * 1000);
    let dayShort2 = new Intl.DateTimeFormat("en-US", justDay).format(secondDay);
    forecastDay2.innerHTML = dayShort2;

    thirdDay = new Date((forecastWeather3.day) * 1000);
    let dayShort3 = new Intl.DateTimeFormat("en-US", justDay).format(thirdDay);
    forecastDay3.innerHTML = dayShort3;

    forecastIcon1.innerHTML = `<img src="https://openweathermap.org/img/wn/${forecastWeather1.icon}@4x.png" alt="">`; 
    forecastIcon2.innerHTML = `<img src="https://openweathermap.org/img/wn/${forecastWeather2.icon}@4x.png" alt="">`; 
    forecastIcon3.innerHTML = `<img src="https://openweathermap.org/img/wn/${forecastWeather3.icon}@4x.png" alt="">`;

    forecastTempDay1 = forecastWeather1.temperature;
    forecastTempDay2 = forecastWeather2.temperature;
    forecastTempDay3 = forecastWeather3.temperature;
}

//----------------Reset Celsius/Fahrenheit colors-----------------
function resetColors() {
    celsiusTemp.classList.remove("lightColor");
    celsiusTemp.classList.remove("darkColor");
    fahrenheitTemp.classList.remove("lightColor");
    fahrenheitTemp.classList.remove("darkColor");
}

//---------------------Temperature Switch------------------------------
function temperatureChange() {
    if (!temperature) {
        celsiusTemp.setAttribute("hidden");
        fahrenheitTemp.setAttribute("hidden");

        tempInner.setAttribute("hidden");
        weatherInner.setAttribute("hidden");
        forecastInner.setAttribute("hidden");
    } else {
        celsiusTemp.removeAttribute("hidden");
        fahrenheitTemp.removeAttribute("hidden");

        tempInner.removeAttribute("hidden");
        weatherInner.removeAttribute("hidden");
        forecastInner.removeAttribute("hidden");
    }
}

//-----------------------Show/Hide Loading-------------------------
function showLoading(show) {
    if (show === true) {
        loadingContainer.style.visibility = "visible";
    } else {
        loadingContainer.style.visibility = "hidden";
    }
}

//-----------------------Celsius Temperature----------------------
function celsiusTemperature() {
    temperature.innerHTML = kelvinToCelsius(temp).toFixed() + "°C";
    feelsLike.innerHTML = "Feels like: " + kelvinToCelsius(weatherFeelsLike).toFixed() + "°C";

    forecastTemp1.innerHTML = kelvinToCelsius(forecastTempDay1).toFixed() + "°C";
    forecastTemp2.innerHTML = kelvinToCelsius(forecastTempDay2).toFixed() + "°C";
    forecastTemp3.innerHTML = kelvinToCelsius(forecastTempDay3).toFixed() + "°C";

    celsiusTemp.removeAttribute("style", "color:#7e7d7d");
    fahrenheitTemp.setAttribute("style", "color:#7e7d7d");

    if (weatherCondition === "rain" || weatherCondition === "snow") {
        celsiusTemp.classList.remove("lightColor");
        fahrenheitTemp.classList.remove("darkColor");
        celsiusTemp.removeAttribute("style", "color:#7e7d7d");
        fahrenheitTemp.classList.add("lightColor");
    } else if (weatherCondition === "clear" || weatherCondition === "atmosphere") {
        celsiusTemp.classList.remove("darkColor");
        fahrenheitTemp.classList.remove("lightColor");
        celsiusTemp.removeAttribute("style", "color:#7e7d7d");
        fahrenheitTemp.classList.add("darkColor");
    }
}

//-----------------------Fahrenheit Temperature-----------------------
function fahrenheitTemperature() {
    temperature.innerHTML = kelvinToFahrenheit(temp).toFixed() + "°F";
    feelsLike.innerHTML = "Feels like: " + kelvinToFahrenheit(weatherFeelsLike).toFixed() + "°F";

    forecastTemp1.innerHTML = kelvinToFahrenheit(forecastTempDay1).toFixed() + "°F";
    forecastTemp2.innerHTML = kelvinToFahrenheit(forecastTempDay2).toFixed() + "°F";
    forecastTemp3.innerHTML = kelvinToFahrenheit(forecastTempDay3).toFixed() + "°F";

    fahrenheitTemp.removeAttribute("style", "color:#7e7d7d");
    celsiusTemp.setAttribute("style", "color:#7e7d7d");
    
    if (weatherCondition === "rain" || weatherCondition === "snow") {
        fahrenheitTemp.classList.remove("lightColor");
        celsiusTemp.classList.remove("darkColor");
        fahrenheitTemp.removeAttribute("style", "color:#7e7d7d");
        celsiusTemp.classList.add("lightColor");
    } else if (weatherCondition === "clear" || weatherCondition === "atmosphere") {
        fahrenheitTemp.classList.remove("darkColor");
        celsiusTemp.classList.remove("lightColor");
        fahrenheitTemp.removeAttribute("style", "color:#7e7d7d");
        celsiusTemp.classList.add("darkColor");
    }
}

//-----------------------Kelvin to Celsius convert-------------------
function kelvinToCelsius(kelvin) {
    return (kelvin - 273.15);
}

//-----------------------Kelvin to Fahrenheit convert-------------------
function kelvinToFahrenheit(kelvin) {
    return (((kelvin - 273.15) * (9 / 5)) + 32);
}

//-----------------------m/s to km/h convert-------------------
function msToKmh(ms) {
    return ms * 3.6;
}

//------------------------------Date---------------------------------------
let today = new Date();
const optionOne = { weekday: "long" };
let dayLong = new Intl.DateTimeFormat("en-US", optionOne).format(today);
const optionTwo = { month: "long" };
let month = new Intl.DateTimeFormat("en-US", optionTwo).format(today);
let dateToday = dayLong + ", " + today.getDate() + " " + month + " " + today.getFullYear();
date.innerHTML = dateToday;

//-----------------------------Backgrounds----------------------------------
function dayBackground() {
    bodyElement.style.backgroundImage = 'url("./images/day.jpg")';
    forecastDay2.classList.remove("lightColor");
    forecastTemp2.classList.remove("lightColor");
    date.classList.remove("darkColor");
}

function nightBackground() {
    bodyElement.style.backgroundImage = 'url("./images/night.jpg")';
    forecastDay2.classList.add("lightColor");
    forecastTemp2.classList.add("lightColor");
    date.classList.remove("darkColor");
}

function cloudsBackground() {
    bodyElement.style.backgroundImage = 'url("./images/clouds.jpg")';
    forecastDay2.classList.remove("lightColor");
    forecastTemp2.classList.remove("lightColor");
    date.classList.remove("darkColor");
}

function rainBackground() {
    bodyElement.style.backgroundImage = 'url("./images/rain.jpg")';
    forecastDay2.classList.add("lightColor");
    forecastTemp2.classList.add("lightColor");
    date.classList.remove("darkColor");
}

function clearBackground() {
    bodyElement.style.backgroundImage = 'url("./images/clear.jpg")';
    forecastDay2.classList.remove("lightColor");
    forecastTemp2.classList.remove("lightColor");
    date.classList.remove("darkColor");
}

function atmosphereBackground() {
    bodyElement.style.backgroundImage = 'url("./images/atmosphere.jpg")';
    forecastDay2.classList.add("lightColor");
    forecastTemp2.classList.add("lightColor");
    date.classList.add("darkColor");
}

function snowBackground() {
    bodyElement.style.backgroundImage = 'url("./images/snow.jpg")';
    forecastDay2.classList.remove("lightColor");
    forecastTemp2.classList.remove("lightColor");
    date.classList.remove("darkColor");
}

function renderBackground(weatherType) {
    if (weatherType === "Clouds") {
        cloudsBackground();
        weatherCondition = "clouds";
    } else if ( weatherType === "Clear") {
        clearBackground();
        weatherCondition = "clear";
    } else if (weatherType === "Mist" || weatherType === "Smoke" || weatherType === "Haze" || weatherType === "Dust" || weatherType === "Fog" || weatherType === "Sand" || weatherType === "Ash" || weatherType === "Squall" || weatherType === "Tornado") {
        atmosphereBackground();
        weatherCondition = "atmosphere";
    } else if (weatherType === "Snow") {
        snowBackground();
        weatherCondition = "snow";
    } else if (weatherType === "Rain" || weatherType === "Drizzle" || weatherType === "Thunderstorm") {
        rainBackground();
        weatherCondition = "rain";
    }
}

function defaultBackground() {
    let hours = new Date().getHours();
    if (hours >= 5 && hours <= 17) {
        dayBackground();
    } else {
        nightBackground();
    }
}