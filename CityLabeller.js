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
 *  @param {object} mapFacade A map facade
 */
function CityLabeller(mapFacade, aCitiesUrl, aCityIconUrl) {
  this.mapFacade = mapFacade;
  this.citiesUrl = aCitiesUrl;
  this.cityIconUrl = aCityIconUrl;

  /** Fetches the largest cities in a bounding box, with their name and lat/lng.
   *  @param anUpper {float} The northernmost boundary of the map's view
   *  @param aLower {float} The southernmost boundary of the maps's view
   *  @param aLeft {float} The westernmost boundary of the map's view
   *  @param aRight {float} The easternmost boundary of the map's view
   *  @param isCartogram {boolean} Whether the map project is a cartogram
   *  @private
   * SIDE EFFECT: Sends off an HTTP request
   */
  this.requestCityInfo = function(anUpper, aLower, aLeft, aRight, 
                                   isCartogram) {
    if (!this.citiesUrl || !this.cityIconUrl) {
      return;
    }
    var url = this.citiesUrl;  // purely to shorten the line lengths
    url += 'upper='+ anUpper + '&lower='+ aLower + 
           '&left='+ aLeft + '&right='+ aRight;
    url += '&zoom='+ this.mapFacade.getZoom() + '&cartogram='+ isCartogram;

    // request is a verb here
    Utilities.requestUrlWithScope(url, this.showCityLabels, this);
  };


  /** Fetches the largest cities in a bounding box, with their name and lat/lng.
   *  @param responseText {object} A JSON string with information about
   *    the visible cities
   *  @private
   * SIDE EFFECT: shows cities' names on the map
   */
  this.showCityLabels = function(responseText) {
    var cities = JSON.parse(responseText);
    this.mapFacade.removeAllCityLabels();

    // add all the markers
    var shouldShowCities = DomFacade.isCityCheckboxChecked();
    if (shouldShowCities) {
      var lat, lng, latlng, cityName, cityNameIconUrl, cityNameIcon, marker;
      var scope = this;
      $.each(cities, function(index, city) {
        lat = city.lat;
        lng = city.lng;
        cityName = city.description;
        cityNameIconUrl = scope.cityIconUrl + 'cityName=' + cityName;
        scope.mapFacade.addCityLabel(lat, lng, cityName, cityNameIconUrl);
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
    if(DomFacade.isCityCheckboxChecked()) {
      var isCartogram = DomFacade.isCartogramCheckboxChecked();
      var north = scope.mapFacade.getNorthBound();
      var south = scope.mapFacade.getSouthBound();
      var east = scope.mapFacade.getEastBound();
      var west = scope.mapFacade.getWestBound();
  
      // NOTE!  cgi-bin/getCities uses popCartDotAttributes, which only has data
      // from 2010.  The city labels are approximate enough that that's probably
      // good enough for all years, but at some point I should add data for other
      // years and add a =polyYear= parameter.
      scope.requestCityInfo(north, south, west, east, isCartogram);
    } else {
      scope.mapFacade.removeAllCityLabels();
    }
  };

}
