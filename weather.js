'use strict';

const weather_api = 'http://api.weatherapi.com/v1/forecast.json?key=6336235ca72d4b6eb28180539220103&q=Helsinki&days=5&aqi=yes&alerts=yes';
const display = document.querySelector('#weatherPrint');
const weather_form = document.querySelector('form');
let temp, weather, feeling, max, min, average, chance, fore_weather, sunrise, sunset, time;

weather_form.addEventListener('submit', function(event) {
  event.preventDefault();
  fetch(weather_api).
      then(function(response) {
        return response.json();
      }).
      then(function(layout) {
        console.log(layout);
        for(let i = 0; i < layout.length; i++) {

          temp = layout[i].show.temp_c;
          let listTemp = document.createElement('li');
          listTemp.innerHTML = temp;
          document.body.appendChild(listTemp);
          display.appendChild(listTemp);

        }
      }).
      catch(function(error) {
        console.log(error);
      });
});