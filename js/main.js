'use strict';

const map = L.map('map').setView([60.172659, 24.926596],11);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);


//success-funktio ajetaan kun paikkatiedot on saatu, error tulee jos haku ei onnistu ja options on hakuasetukset
const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

function success(pos) {
  const crd = pos.coords;

  map.setView([crd.latitude, crd.longitude], 11);

  const ownLocation = addMarker(crd, 'Olen tässä');
  ownLocation.openPopup();

  getLocations(crd).then(function(pointsOfInterest) {
    for (let i = 0; i < pointsOfInterest.length; i++) {
      const placeName = pointsOfInterest[i].name_fi;
      const coordinates = {
        latitude: pointsOfInterest[i].latitude,
        longitude: pointsOfInterest[i].longitude,
      };
      addMarker(coordinates, placeName);
    }
  });
}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

//paikkatietojen haku Helsingin Kaupungin API:sta
navigator.geolocation.getCurrentPosition(success, error, options);

function getLocations(crd) {
  const url = 'https://www.hel.fi/palvelukarttaws/rest/v4/unit/?ontologyword=317+318+319+320+321+322+323';
  return fetch(url).then(function(response) {
    return response.json();
  }).then(function(pointsOfInterest) {
    console.log(pointsOfInterest);
    return pointsOfInterest;
  });
}

// Funktio, joka lisää markkerin kartalle
function addMarker(crd, teksti) {
  return L.marker([crd.latitude, crd.longitude]).
      addTo(map).
      bindPopup(teksti);
}