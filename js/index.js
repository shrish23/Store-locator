
window.onload = function() {
  
}

var map;
var markers = [];
var infoWindow ;


function initMap() {
    var losAngeles = 
    {
        lat: 34.075260, 
        lng: -118.375572
    };
    map = new google.maps.Map(document.getElementById('map'), {
      center: losAngeles,
      zoom: 11,
      mapTypeId: 'roadmap',
      mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU},
      styles:[
              {elementType: 'geometry', stylers: [{color: '#ebe3cd'}]},
              {elementType: 'labels.text.fill', stylers: [{color: '#523735'}]},
              {elementType: 'labels.text.stroke', stylers: [{color: '#f5f1e6'}]},
              {
                featureType: 'administrative',
                elementType: 'geometry.stroke',
                stylers: [{color: '#c9b2a6'}]
              },
              {
                featureType: 'administrative.land_parcel',
                elementType: 'geometry.stroke',
                stylers: [{color: '#dcd2be'}]
              },
              {
                featureType: 'administrative.land_parcel',
                elementType: 'labels.text.fill',
                stylers: [{color: '#ae9e90'}]
              },
              {
                featureType: 'landscape.natural',
                elementType: 'geometry',
                stylers: [{color: '#dfd2ae'}]
              },
              {
                featureType: 'poi',
                elementType: 'geometry',
                stylers: [{color: '#dfd2ae'}]
              },
              {
                featureType: 'poi',
                elementType: 'labels.text.fill',
                stylers: [{color: '#93817c'}]
              },
              {
                featureType: 'poi.park',
                elementType: 'geometry.fill',
                stylers: [{color: '#a5b076'}]
              },
              {
                featureType: 'poi.park',
                elementType: 'labels.text.fill',
                stylers: [{color: '#447530'}]
              },
              {
                featureType: 'road',
                elementType: 'geometry',
                stylers: [{color: '#f5f1e6'}]
              },
              {
                featureType: 'road.arterial',
                elementType: 'geometry',
                stylers: [{color: '#fdfcf8'}]
              },
              {
                featureType: 'road.highway',
                elementType: 'geometry',
                stylers: [{color: '#f8c967'}]
              },
              {
                featureType: 'road.highway',
                elementType: 'geometry.stroke',
                stylers: [{color: '#e9bc62'}]
              },
              {
                featureType: 'road.highway.controlled_access',
                elementType: 'geometry',
                stylers: [{color: '#e98d58'}]
              },
              {
                featureType: 'road.highway.controlled_access',
                elementType: 'geometry.stroke',
                stylers: [{color: '#db8555'}]
              },
              {
                featureType: 'road.local',
                elementType: 'labels.text.fill',
                stylers: [{color: '#806b63'}]
              },
              {
                featureType: 'transit.line',
                elementType: 'geometry',
                stylers: [{color: '#dfd2ae'}]
              },
              {
                featureType: 'transit.line',
                elementType: 'labels.text.fill',
                stylers: [{color: '#8f7d77'}]
              },
              {
                featureType: 'transit.line',
                elementType: 'labels.text.stroke',
                stylers: [{color: '#ebe3cd'}]
              },
              {
                featureType: 'transit.station',
                elementType: 'geometry',
                stylers: [{color: '#dfd2ae'}]
              },
              {
                featureType: 'water',
                elementType: 'geometry.fill',
                stylers: [{color: '#b9d3c2'}]
              },
              {
                featureType: 'water',
                elementType: 'labels.text.fill',
                stylers: [{color: '#92998d'}]
              }
            ]
    });
    infoWindow = new google.maps.InfoWindow();
    searchStores();
}

function searchStores(){
  var foundStores = [];
  var zipCode = document.getElementById('zip-code-input').value;
  if(zipCode){
  
    for(var store of stores){
      var postal = store['address']['postalCode'].substring(0,5);
      if(postal == zipCode){
        foundStores.push(store);
      }
    }
  }
  else{
    foundStores = stores;
  }
  clearLocations();
  displayStores(foundStores);
  showStoresMarkers(foundStores);
  setOnClickListener();
}

function clearLocations(){
  infoWindow.close();
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers.length = 0;
}

function setOnClickListener(){
  var storeElements = document.querySelectorAll('.store-container');
  storeElements.forEach(function(elem, index){
      elem.addEventListener('click', function() {
        new google.maps.event.trigger(markers[index], 'click');
      })
  })
}

function showStoresMarkers(stores) {
  var bounds = new google.maps.LatLngBounds();
  for(var [index, store] of stores.entries()){
    var latlng = new google.maps.LatLng(
      store["coordinates"]["latitude"],
      store["coordinates"]["longitude"]);
    var name = store['name'];
    var address = store["addressLines"];
    var phone = store["phoneNumber"];
    var openstatus = store['openStatusText'];
    bounds.extend(latlng);
    createMarker(latlng, name, address, phone, openstatus, index+1)

  }
  map.fitBounds(bounds);
}

function createMarker(latlng, name, address, phone, openstatus, index) {
  var html = `
                  <div class="iw-container">
                    <div class="iw-title">${name}</div> 
                    <div class="iw-content">
                      <div class="iw-subTitle">${openstatus}</div>
                      <hr>
                      <p><i class="fas fa-location-arrow"></i><a href="https://www.google.com/maps/dir/?api=1&destination=${address}" target="_blank">${address}</a><br>
                      <br><div class="iw-phone-icon"><i class="fas fa-phone"></i>${phone}</p></div>
                    </div>
                  </div>
`;
  var image = {
          url: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/1024px-Starbucks_Corporation_Logo_2011.svg.png',
          // This marker is 20 pixels wide by 32 pixels high.
          size: new google.maps.Size(30, 45),
          // The origin for this image is (0, 0).
          origin: new google.maps.Point(0, 0),
          // The anchor for this image is the base of the flagpole at (0, 32).
          anchor: new google.maps.Point(0, 45)
        };
  
  var shape = {
          coords: [1, 1, 1, 20, 18, 20, 18, 1],
          type: 'poly'
        };

  
  var marker = new google.maps.Marker({
    map: map,
    position: latlng,
    draggable:false,
    //label: index.toString(),
    animation:google.maps.Animation.DROP,
    shape:shape,
    icon:'Coffee_5.svg'
  });

  google.maps.event.addListener(marker, 'click', function() {
    infoWindow.setContent(html);
    infoWindow.open(map, marker);
  });
  markers.push(marker);
}

function displayStores(stores){
  var storesHtml = '';
  for(var [index, store] of stores.entries()){
    var address = store['addressLines'];
    var phone = store['phoneNumber'];
    storesHtml += `
    <div class="store-container">
      <div class="store-container-background">
            <div class="store-info-container">
                
                
                <div class="store-address">
                    <span>${address[0]}</span>
                    <span>${address[1]}</span>
                </div>
                <div class="store-phone-number">
                    ${phone}
                </div>
            </div>

            <div class="store-number-container">
                <div class="store-number">
                    ${++index}
                </div>
            </div>
      </div>
    </div>
    
    `
    document.querySelector('.stores-list').innerHTML = storesHtml;
  }  
}

