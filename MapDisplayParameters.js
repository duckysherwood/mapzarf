// This holds a bucket of parameters used to define how the map is
// displayed: the choropleth layer, the dots layer, the border layer,
// the lat/lng/zoom/center of the map, and where the marker is

// Figure out what parameters to use for the maps.
// There are three levels of defaults: 
// 1. What is in the query string
// 2. What is in the mapApplicationInfo
// 3. If all else fails, what is hardcoded.
function MapDisplayParameters () {
  /* @const */ var CENTER_LAT = 38.0
  /* @const */ var CENTER_LNG = -95.0
  /* @const */ var ZOOM = 4
  /* @const */ var MARKER_LAT = 23.0
  /* @const */ var MARKER_LNG = -110.0
  /* @const */ var MAX_CHOROPLETH_LAYERS = 30

  var defaults = Object.create(null)
  
  defaults.lat = [parseFloat, CENTER_LAT, -90, 90];
  defaults.lng = [parseFloat, CENTER_LNG, -180, 180];
  defaults.zoom = [parseInt, ZOOM, 0, 14];
  defaults.markerLat = [parseFloat, MARKER_LAT, -90, 90];
  defaults.markerLng = [parseFloat, MARKER_LNG, -180, 180];

  defaults.showChoropleths = [toBoolean, true, false, true];
  defaults.showDots = [toBoolean, true, false, true];
  defaults.showBorders = [toBoolean, true, false, true];
  defaults.choroplethIndex = [parseInt, 0, 0, MAX_CHOROPLETH_LAYERS];
  defaults.dotIndex = [parseInt, 0, 0, MAX_CHOROPLETH_LAYERS];
  defaults.borderIndex = [parseInt, 0, 0, MAX_CHOROPLETH_LAYERS];
  defaults.showCities = [toBoolean, true, false, true];

  // isCartogram?
  defaults.cartogram = [toBoolean, true, false, true];
  // borders
  defaults.states = [toBoolean, true, false, true];
  defaults.districts = [toBoolean, false, false, true];

  
  
  // for getting the query string, from
  // http://stackoverflow.com/questions/647259/javascript-query-string
  // also consider URI.js
  // http://medialize.github.io/URI.js/
  this.getQueryString = function () {
      var result = {}, queryString = location.search.slice(1),
          re = /([^&=]+)=([^&]*)/g, m;
  
      while (m = re.exec(queryString)) {
          result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
      }
  
      return result;
  }

  // Takes a parameter key and a candidate value.
  // If the candidate value is valid and in bounds, stick it into 
  // defaults[param].  If the candidate value is not okay, dump it.
  // Returns the value of defaults[param] afterwards (for testing).
  // *** SIDE EFFECT *** Modifies defaults 
  this.validateAndUpdate = function(paramKey, candidateValue) {
    if(!defaults[paramKey]) {
      return null
    }

    var paramDefaultArray = defaults[paramKey];

    // It would be more legible if each element of defaults was an 
    // object, but I value the terseness when creating the array.
    var parseFunction = paramDefaultArray[0];
    var paramDefault = paramDefaultArray[1];
    var paramMin = paramDefaultArray[2];
    var paramMax = paramDefaultArray[3];

    // When the candidate value comes from the query string,
    // it needs to be converted into a value
    if(typeof candidateValue == 'string') {
      if(!parseFunction) {
        return defaults[paramKey]
      }

      candidateValue = parseFunction(candidateValue);

      // There are no strings which are valid parameters,
      // so if it is still a string, something is very wrong.
      if(typeof candidateValue == 'string') {
        return defaults[paramKey]
      }
    }

    // check for well-formed value, min, max
    if((!isNaN(candidateValue)) &&
       (candidateValue >= paramMin) &&
       (candidateValue <= paramMax)) {
      defaults[paramKey][1] = candidateValue;
    } else {
      defaults[paramKey][1] = paramDefault;
    }
  return defaults[paramKey][1]
  }

  // It would be simpler to code if the MapApplicationInfo parameters
  // lined up nicely with the =defaults= parameters, but I would rather
  // make the URL more human-readable.
  // *** SIDE EFFECT *** Changes =defaults=
  this.createDefaultsFromMapApplicationInfo = function (mai) {

    // Note that the MAI doesn't give direction on how the UI
    // buttons and dropdowns are set
    var translator = { 'startingCenterLat' : 'lat',
                       'startingCenterLng' : 'lng',
                       'startingCenterZoom' : 'zoom',
                       'hasCartogram' : 'cartogram',    
                       'startingMarkerLat' : 'markerLat',
                       'startingMarkerLng' : 'markerLng' }

    var closureScope = this
    $.each( translator , function ( key, value ) {
      if(mai.hasOwnProperty(key) && value != undefined && value != null) {
        closureScope.validateAndUpdate(translator[key], mai[key])
      }
    })
    return defaults // useful for testing
  }

  // *** SIDE EFFECT *** modifies defaults
  this.initializePageParametersFromQueryString = function (qstring) {
    var closureScope = this
    $.each(defaults, function (key, ignore) {
      closureScope.validateAndUpdate(key, qstring[key])
    })

    return defaults
  }

  this.getValues = function() {
    var init = {}
    $.each(defaults, function(index, value) {
      init[index] = value[1]
    })
    return init
  }


}


