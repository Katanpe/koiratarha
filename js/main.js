'use strict';

//lisätään kartta sivustolle
const map = L.map('map');
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

//API, jota käytetään reitin hakuun
const routingAPI = 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql';

// haetaan reitti lähtöpisteen ja kohteen avulla
function getRoute(lahto, kohde) {
  // GraphQL haku
  const haku = `{
  plan(
    from: {lat: ${lahto.latitude}, lon: ${lahto.longitude}}
    to: {lat: ${kohde.latitude}, lon: ${kohde.longitude}}
    numItineraries: 1
  ) {
    itineraries {
      legs {
        startTime
        endTime
        mode
        duration
        distance
        legGeometry {
          points
        }
      }
    }
  }
}`;

  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({query: haku}), // GraphQL haku lisätään queryyn
  };

  // lähetetään haku
  fetch(routingAPI, fetchOptions).then(function (vastaus) {
    return vastaus.json();
  }).then(function (tulos) {
    //console.log(tulos.data.plan.itineraries[0].legs);
    const googleKoodattuReitti = tulos.data.plan.itineraries[0].legs;
    for (let i = 0; i < googleKoodattuReitti.length; i++) {
      let color = '';
      switch (googleKoodattuReitti[i].mode) {
        case 'WALK':
          color = 'green';
          break;
        case 'BUS':
          color = 'red';
          break;
        case 'RAIL':
          color = 'cyan'
          break;
        case 'TRAM':
          color = 'magenta'
          break;
        default:
          color = 'blue';
          break;
      }
      const reitti = (googleKoodattuReitti[i].legGeometry.points);
      const pisteObjektit = L.Polyline.fromEncoded(reitti).getLatLngs(); // fromEncoded: muutetaan Googlekoodaus Leafletin Polylineksi
      L.polyline(pisteObjektit).setStyle({
        color
      }).addTo(map);
    }
    map.fitBounds([[lahto.latitude, lahto.longitude], [kohde.latitude, kohde.longitude]]);
  }).catch(function (e) {
    console.error(e.message);
  });
}

//paikkatietojen hakuasetukset
const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

//paikkatiedot haettu onnistuneesti
function success(pos) {
  const crd = pos.coords;
  console.log(crd);

  //lisätään oman sijainnin marker
  const ownLocation = addMarker(crd, 'Olen tässä!');
  ownLocation.openPopup();

  //lisätään markerit kohdepaikoille
  getLocations(crd).then(function(pointsOfInterest) {
    for (let i = 0; i < pointsOfInterest.length; i++) {
      const placeName = pointsOfInterest[i].name_fi;
      const coordinates = {
        latitude: pointsOfInterest[i].latitude,
        longitude: pointsOfInterest[i].longitude,
      };
      const marker = addMarker(coordinates, placeName);
      marker.on('click', function(){
        document.querySelector('#name').innerHTML = pointsOfInterest[i].name_fi;
        document.querySelector('#address').innerHTML = pointsOfInterest[i].street_address_fi;
        document.querySelector('#city').innerHTML = pointsOfInterest[i].address_city_fi;
        console.log(pointsOfInterest[i]);
      })
    }
  });

  navigationListener();

  getRoute(crd, {latitude: 60.1636578, longitude: 24.9289657})
}

//paikkatietojen hakemisessa on tapahtunut virhe
function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

//omien paikkatietojen haku
navigator.geolocation.getCurrentPosition(success, error, options);

//kohdesijaintien haku Helsingin kaupungin APISTA
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

//navigointinappia painaessa
function navigationListener() {
  document.querySelector('#buttonNavigation').addEventListener('click', function () {
    console.log('Klikattu!');
  })
}

