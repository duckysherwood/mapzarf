/** @author Kaitlin Duck Sherwood
 *  @class CityLabeller
 *  @classdesc This class shows cities on leaflet map at the appropriate
 *    place, which is tricky because the map can be mercator or 
 *    cartogram.  Instead of trying to take the time to calculate the 
 *    lat/lng for the cartogram on the fly from the mercator lat/lng,
 *    it's precalculated in a different database table or under a different
 *    field name; the table/fieldName is specified in the mapApplicationInfo.
 * 
 *  @constructor
 *  @this {CityLabeller}
 *  @param aMap {object} A Leaflet map object.
 *  @param aJurisdictionMarker {object} A Leaflet marker
 */
function CityLabeller(aMap) {
  this.mapObject = aMap;
  this.cityMarkers = [];

  /** Fetches the largest cities in a bounding box, with their name and lat/lng.
   *  @param anUpper {float} The northernmost boundary of the map's view
   *  @param aLower {float} The southernmost boundary of the maps's view
   *  @param aLeft {float} The westernmost boundary of the map's view
   *  @param aRight {float} The easternmost boundary of the map's view
   *  @param isCartogram {boolean} Whether the map project is a cartogram
   *  @private
   * SIDE EFFECT: Sends off an HTTP request
   */
  this.requestCityInfo = function (anUpper, aLower, aLeft, aRight, 
                                   isCartogram) {
    // Because this is python, it needs to be in cgi-bin.  PHP is the only
    // one that can be in the local directory
    var url = "/cgi-bin/getCities.py";
    url += "?upper="+anUpper+"&lower="+aLower+"&left="+aLeft+"&right="+aRight;
    url += "&zoom="+this.mapObject.getZoom()+"&cartogram="+isCartogram;

    // request is a verb here
    Utilities.requestUrlWithScope(url, this.showCityLabels, this);  
  };
  
  
  /** Removes all the city labels from the map.
   *  @private
   *  SIDE EFFECT: removes all the city labels from the map
   */
  this.removeCityLabels = function() {
    var mapDiv = $( '#map')[0];
    var kids = mapDiv.childNodes;
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
          this.mapDiv.removeChild( kids[k] );
        } else {
          console.log("Error: Node name is not P for "+kids[k].tagName);
        }
      }
    }
  };
  
  /** Fetches the largest cities in a bounding box, with their name and lat/lng.
   *  @param responseText {object} A JSON string with information about 
   *    the visible cities 
   *  @private
   * SIDE EFFECT: shows cities' names on the map
   */
  this.showCityLabels = function(responseText) {
    // http://stackoverflow.com/questions/9912145/leaflet-how-to-find-existing-markers-and-delete-markers
    var cities = JSON.parse(responseText);
    // delete all the markers which are there
    for(var i=0;i<this.cityMarkers.length;i++) {
        this.mapObject.removeLayer(this.cityMarkers[i]);
    }  
    
    // add all the markers
    // TODO remove dependence on global variable L
    var shouldShowCities = $('#showCitiesCheckbox')[0].checked;
    if(shouldShowCities) {
      var lat, lng, latlng, cityName, cityNameIconUrl, cityNameIcon, marker;
      var scope = this;
      $.each(cities, function(index, city) {
        lat = city.lat;
        lng = city.lng;
        latlng = new L.LatLng(lat, lng);
        cityName = city.description;
        
        cityNameIconUrl = BINDIR + '/makeCityLabel.php?cityName=' + cityName;
        cityNameIcon = L.icon({iconUrl: cityNameIconUrl, iconAnchor: [2, 10]});
  
        marker = L.marker(latlng, {icon: cityNameIcon, clickable:false, draggable:false}); 
        scope.cityMarkers.push(marker);
        scope.mapObject.addLayer(marker);
      });
    } 
  };
  
  /** Shows the largest cities on the map.
   *  @param scope {object} The scope which should be used for removing
   *    city labels
   *  @private
   * SIDE EFFECT: shows cities' names on the map
   */
  this.refreshCityLabels = function(scope) {
  
    var bounds = this.mapObject.getBounds();
    var upper = bounds.getNorthEast().lat;
    var lower = bounds.getSouthWest().lat;
    var left = bounds.getSouthWest().lng;
    var right = bounds.getNorthEast().lng;
  
    var isCartogram =  $( '#isCartogramCheckbox' ).is(':checked');
  
    // NOTE!  cgi-bin/getCities uses popCartDotAttributes, which only has data
    // from 2010.  The city labels are approximate enough that that's probably 
    // good enough for all years, but at some point I should add data for other 
    // years and add a =polyYear= parameter.
    scope.removeCityLabels();
    scope.requestCityInfo(upper, lower, left, right, isCartogram);
  };

}
