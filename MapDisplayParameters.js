/** @author Kaitlin Duck Sherwood
 *  @class MapDisplayParameters
 *  @classdesc
    This holds a bucket of parameters used to define how the map is
 *  displayed: the choropleth layer, the dots layer, the border layer,
 *  the lat/lng/zoom/center of the map, and where the marker is
 *
 *  @constructor
 */
function MapDisplayParameters(omai) {
  /* @private */ this.omai = omai;

  /* @const */ var CENTER_LAT = 38.0;
  /* @const */ var CENTER_LNG = -95.0;
  /* @const */ var ZOOM = 4;
  /* @const */ var MARKER_LAT = 23.0;
  /* @const */ var MARKER_LNG = -110.0;
  /* @const */ var MAX_CHOROPLETH_LAYERS = 30;

  var defaults = Object.create(null);

  this.toBoolean = function(aString) {
    return (aString == 't');
  };

  // validation routine, default, min, max
  defaults.lat = [parseFloat, CENTER_LAT, -90, 90];
  defaults.lng = [parseFloat, CENTER_LNG, -180, 180];
  defaults.zoom = [parseInt, ZOOM, 0, 14];
  defaults.markerLat = [parseFloat, MARKER_LAT, -90, 90];
  defaults.markerLng = [parseFloat, MARKER_LNG, -180, 180];

  defaults.showCities = [this.toBoolean, true, false, true];

  // isCartogram?
  defaults.cartogram = [this.toBoolean, true, false, true];


  /** Returns the parameters defining the initial conditions of the
   *  map/DOM.
   *  There are three places the initial conditions get set, taken in
   *  this precedence order:
   *    1. What is in the query string
   *    2. What is in the mapApplicationInfo
   *    3. If all else fails, what is hardcoded.
   *  @return {Object} The parameters defining the initial conditions
   *  @public
   */
  this.getPageValueParameters = function() {
    this.createDefaultsFromMapApplicationInfo();
    var queryString = this.getQueryString();
    this.initializePageParametersFromQueryString(queryString);
    return this.getValues();
  };


  /** Gets the query string, code adapted from
   *  http://stackoverflow.com/questions/647259/javascript-query-string
   *  @return {Object} Returns an object representing the query string
   *  @private
   */
  // for getting the query string, from
  this.getQueryString = function() {
      var result = {}, queryString = location.search.slice(1),
          re = /([^&=]+)=([^&]*)/g, m;

      while (m = re.exec(queryString)) {
          var key = decodeURIComponent(m[1]);
          var value = decodeURIComponent(m[2]);
          // legal values in query strings are numbers, letters, ".", and "-"
          // Some people say not to bother sanitizing input on the client side,
          // but I don't want to be complicit in URL malware hacks.
          value = value.replace(/[^\w\.\-]/g, '');
          result[key] = value;
      }

      return result;
  };

  /** Takes a parameter key and a candidate value.  If the candidate
   *  value is valid and in bounds, stick it into defaults[param].  If
   * the candidate value is not okay, dump it.
   *  @return {Object} The value of defaults[param] (return value used
   *    only for testing, probably)
   *  @private
   */
  // *** SIDE EFFECT *** Modifies defaults
  this.validateAndUpdate = function(paramKey, candidateValue) {
    if (!defaults[paramKey]) {
      return null;
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
    if (typeof candidateValue == 'string') {
      if (!parseFunction) {
        console.log('ERROR: No parse function for validating key '+ paramKey);
        return defaults[paramKey];
      }

      candidateValue = parseFunction(candidateValue);

      // There are no strings which are valid parameters,
      // so if it is still a string, something is very wrong.
      if (typeof candidateValue == 'string') {
        return defaults[paramKey];
      }
    }

    // check for well-formed value, min, max
    if ((!isNaN(candidateValue)) &&
       (candidateValue >= paramMin) &&
       (candidateValue <= paramMax)) {
      defaults[paramKey][1] = candidateValue;
    } else {
      defaults[paramKey][1] = paramDefault;  // i.e. unchanged
    }
  return defaults[paramKey][1];
  };

  /** Overwrites the hardcoded defaults with values taken from
   *  mapApplicationInfo (from the JSON file)
   *  @param {Object } omai The mapApplicationInfo, speciried in the JSON file
   *  @return {Object} The value of defaults (mostly used for testing)
   *  @private
   */
  // *** SIDE EFFECT *** Changes =defaults=
  this.createDefaultsFromMapApplicationInfo = function() {

    // Note that the MAI doesn't give direction on how the UI
    // buttons and dropdowns are set

    //  Yes, it would be simpler to code if the MapApplicationInfo parameters
    //  lined up nicely with the =defaults= parameters, but I would rather
    //  make the URL more human-readable.
    var translator = { 'startingCenterLat' : 'lat',
                       'startingCenterLng' : 'lng',
                       'startingCenterZoom' : 'zoom',
                       'hasCartogram' : 'cartogram',
                       'startingMarkerLat' : 'markerLat',
                       'startingMarkerLng' : 'markerLng' };

    var scope = this;

    // Do the easy ones
    $.each(translator, function(key, value ) {
      if (scope.omai.hasOwnProperty(key) && value) {
        scope.validateAndUpdate(translator[key], omai[key]);
      }
    });

    // Add defaults for every layerset's "index" and "show" values
    if (this.omai.layersets) {
      $.each(this.omai.layersets, function(index, layerset) {
        var layersetName = layerset.shortName;
        var indexName = layersetName + 'Index';
        defaults[indexName] = [];
        defaults[indexName][0] = parseInt;
        defaults[indexName][1] = 0; // default
        defaults[indexName][2] = 0; // min
        if(layerset.layers) {
          defaults[indexName][3] = layerset.layers.length - 1; // max
        } else {
          defaults[indexName][3] = 0;  // max
        }
  
        var showName = 'show' + Utilities.capitalizeFirstLetter(layersetName);
        defaults[showName] = [];
        defaults[showName][0] = scope.toBoolean;
        defaults[showName][1] = true; 
        defaults[showName][2] = false; 
        defaults[showName][3] = true;
      });
    } else {
      assertFalse(true, "Sorry, I really screwed up somehow. " + 
                        "This line should never get executed.");
    }

    return defaults; // useful for testing
  };

  /** Overwrites the defaults with values taken from from the query string
   *  @param {string } qstring The query string of this page's URL
   *  @return {Object} The initialization parameters
   *  @private
   */
  // *** SIDE EFFECT *** Changes =defaults=
  this.initializePageParametersFromQueryString = function(qstring) {
    var scope = this;
    $.each(defaults, function(key, ignore) {
      if(qstring[key]) {
        scope.validateAndUpdate(key, qstring[key]);
      }
    });

    return defaults;
  };

  /** Translates the initialization values from a defaults object
   *  (which has a whole bunch of other information, including functions
   *  to convert and validate the input) into a more simple object
   *  @param {string } qstring The query string of this page's URL
   *  @return {Object} The initialization parameters
   *  @private
   */
  this.getValues = function() {
    var init = {};
    $.each(defaults, function(index, value) {
      init[index] = value[1];
    });
    return init;
  };


}


