'use strict';

const weather_api_forecast = 'http://api.weatherapi.com/v1/forecast.json?key=6336235ca72d4b6eb28180539220103&q=Helsinki&days=5&aqi=yes&alerts=yes&lang=fi';
const display = document.querySelector('#weatherPrint');
const weather_form = document.querySelector('form');
let current, date, temp, weather, feeling, forecast, futureDate, max, min, average, chanceR, chanceS, fore_weather, sunrise, sunset, time;

weather_form.addEventListener('submit', function(event) {
  event.preventDefault();
  fetch(weather_api_forecast).
      then(function(response) {
        return response.json();
      }).
      then(function(layout) {
        console.log(layout);
        current = layout.current;
        forecast = layout.forecast.forecastday;

        let infoCurrent = document.createElement('h2');
        infoCurrent.innerHTML = 'Sää';
        document.body.appendChild(infoCurrent);
        display.appendChild(infoCurrent);

        date = current.last_updated;
        let currentDate = document.createElement('p');
        currentDate.innerHTML = date;
        document.body.appendChild(currentDate);
        display.appendChild(currentDate);

        temp = 'Lämpötila: ' + current.temp_c + ' °C';
        let listTemp = document.createElement('li');
        listTemp.innerHTML = temp;
        document.body.appendChild(listTemp);
        display.appendChild(listTemp);

        feeling = 'Tuntuu kuin: ' + current.feelslike_c + ' °C';
        let listFeeling = document.createElement('li');
        listFeeling.innerHTML = feeling;
        document.body.appendChild(listFeeling);
        display.appendChild(listFeeling);

        weather = 'Säätila: ' + current.condition.text;
        let listWeather = document.createElement('li');
        listWeather.innerHTML = weather;
        document.body.appendChild(listWeather);
        display.appendChild(listWeather);

        let infoForecast = document.createElement('h2');
        infoForecast.innerHTML = 'Sääennuste';
        document.body.appendChild(infoForecast);
        display.appendChild(infoForecast);

          for(let i = 0; i < forecast.length; i++) {

            futureDate = forecast[i].date;
            let listDate = document.createElement('p');
            listDate.innerHTML = futureDate;
            document.body.appendChild(listDate);
            display.appendChild(listDate);

            max = 'Korkein lämpötila: ' + forecast[i].day.maxtemp_c + ' °C';
            let listMax = document.createElement('li');
            listMax.innerHTML = max;
            document.body.appendChild(listMax);
            display.appendChild(listMax);

            min = 'Matalin lämpötila: ' + forecast[i].day.mintemp_c + ' °C';
            let listMin = document.createElement('li');
            listMin.innerHTML = min;
            document.body.appendChild(listMin);
            display.appendChild(listMin);

            average = 'Keskilämpötila: ' + forecast[i].day.avgtemp_c + ' °C';
            let listAverage = document.createElement('li');
            listAverage.innerHTML = average;
            document.body.appendChild(listAverage);
            display.appendChild(listAverage);

            chanceR = 'Vesisateen mahdollisuus: ' + forecast[i].day.daily_chance_of_rain + ' %';
            let listChanceR = document.createElement('li');
            listChanceR.innerHTML = chanceR;
            document.body.appendChild(listChanceR);
            display.appendChild(listChanceR);

            chanceS = 'Lumisateen mahdollisuus: ' + forecast[i].day.daily_chance_of_snow + ' %';
            let listChanceS = document.createElement('li');
            listChanceS.innerHTML = chanceS;
            document.body.appendChild(listChanceS);
            display.appendChild(listChanceS);

            fore_weather = 'Säätila: ' + forecast[i].day.condition.text;
            let listForeWeather = document.createElement('li');
            listForeWeather.innerHTML = fore_weather;
            document.body.appendChild(listForeWeather);
            display.appendChild(listForeWeather);

            sunrise = 'Auringonnousu: ' + forecast[i].astro.sunrise;
            let listSunrise = document.createElement('li');
            listSunrise.innerHTML = sunrise;
            document.body.appendChild(listSunrise);
            display.appendChild(listSunrise);

            sunset = 'Auringonlasku: ' + forecast[i].astro.sunset;
            let listSunset = document.createElement('li');
            listSunset.innerHTML = sunset;
            document.body.appendChild(listSunset);
            display.appendChild(listSunset);
          }
      }).
      catch(function(error) {
        console.log(error);
      });
});