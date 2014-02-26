function CityLabeller(aMapDiv, aMap) {
  this.mapDiv = aMapDiv;
  this.map = aMap;
}

CityLabeller.prototype.requestCityInfo = function (anUpper, aLower, aLeft, aRight, cartogramBoolean) {
  // Because this is python, it needs to be in cgi-bin.  PHP is the only
  // one that can be in the local directory
  var url = "/cgi-bin/getCities.py";
  url += "?upper="+anUpper+"&lower="+aLower+"&left="+aLeft+"&right="+aRight;
  url += "&zoom="+this.map.getZoom()+"&cartogram="+cartogramBoolean;
  requestUrl(url, this.showCityLabels);  // request is a verb here
}


CityLabeller.prototype.removeCityLabels = function() {
  var mapDiv = $( '#map')[0]
  var kids = mapDiv.childNodes
  var klen = kids.length;

  // need to remove labels starting at the back of the list so that
  // the array doesn't get messed up
  // Alternate ways to do this:  make a list
  // of children to delete, mark ones to delete, then delete only those
  if(klen > 2) {
    for(var k=klen-1; k>1; k--) {
      try {
      } catch(TypeError) {
        console.log("Type error: " + kids);
        console.log(kids[k]);
      }

      if(kids[k].nodeName == "P") {
        mapDiv.removeChild( kids[k] );
      } else {
        console.log("Node name is not P for "+kids[k].tagName);
      }
    }
  }
}

CityLabeller.prototype.showCityLabels = function() {
  // Because this is in a callback, we don't have access to the 
  // class' member variables, which seems wrong
  var mapObject =  $.data( $( '#map' )[0], 'mapObject')
  var cityMarkers =  $.data( $( '#map' )[0], 'cityMarkers')

  if (this.readyState==4 && this.status==200)
  {
    // http://stackoverflow.com/questions/9912145/leaflet-how-to-find-existing-markers-and-delete-markers
    var cities = JSON.parse(this.responseText);
    // delete all the markers which are there
    for(i=0;i<cityMarkers.length;i++) {
        mapObject.removeLayer(cityMarkers[i]);
    }  
    
    // add all the markers
    shouldShowCities = showCitiesCheckbox.checked;
    if(shouldShowCities) {
      var lat, lng, latlng, cityName, cityNameIconUrl, cityNameIcon, marker;
      for (var i=0,len=cities.length; i<len; i++) {
        lat = cities[i]["lat"];
        lng = cities[i]["lng"];
        latlng = new L.LatLng(lat, lng);
        cityName = cities[i]["description"];
        
        cityNameIconUrl = '../../mapeteria2/makeCityLabel.php?cityName=' + cityName
        if (typeof bulletChar != 'undefined') {
          cityNameIconUrl += "&bulletChar="+encodeURIComponent(bulletChar);
        }
        cityNameIcon = L.icon({iconUrl: cityNameIconUrl, iconAnchor: [2, 10]});
  
        marker = L.marker(latlng, {icon: cityNameIcon, clickable:false, draggable:false}); 
        cityMarkers.push(marker);
        mapObject.addLayer(marker);
      }
    }
  }
  
}

CityLabeller.prototype.refreshCityLabels = function() {
  var mapObject =  $.data( $( '#map' )[0], 'mapObject')
  var cityLabeller =  $.data( $( '#map' )[0], 'cityLabeller')

  var bounds = mapObject.getBounds();
  var upper = bounds.getNorthEast().lat;
  var lower = bounds.getSouthWest().lat;
  var left = bounds.getSouthWest().lng;
  var right = bounds.getNorthEast().lng;

  var isCartogram =  $( '#isCartogramCheckbox' ).is(':checked')
console.log(isCartogram + " / isCartogram")


  // NOTE!  cgi-bin/getCities uses popCartDotAttributes, which only has data
  // from 2010.  The city labels are approximate enough that that's probably 
  // good enough for all years, but at some point I should add data for other 
  // years and add a =polyYear= parameter.
  cityLabeller.removeCityLabels();
  cityLabeller.requestCityInfo(upper, lower, left, right, isCartogram);
}

