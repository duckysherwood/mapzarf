/** @author Kaitlin Duck Sherwood
 *  @class Runner
 *  @classdesc This class is the entry point for all the other code,
 *    sort of like =main()= in C programs.
 * 
 *  @constructor
 *  @param mapApplicationInfo {object} A JSON object with information 
 *    about how to set up the map.
 */
function Runner() {
  this.mai = null;
}

/** This is where execution really kicks off.  This is a callback from
 *  the $.get of the MAI file.
 *  @public
 */
Runner.prototype.start = function (data, textStatus, jqXhr) {

  if(textStatus != 'success') {
    this.maiAlert();
  }

  this.mai = data;

  var mapDisplayParameters = new MapDisplayParameters(this.mai);
  var pageInitValues = mapDisplayParameters.getPageValueParameters();


  // L (from Leaflet) is global scope, but we need =map= in this scope
  // so we can pass it to behaviour
  var myMap = L.map("map", {minZoom: 0, maxZoom: 14});

  // jurisdictionMarker needs to be in this scope
  var jurisdictionMarker = null;
  if(this.mai.startingMarkerLat && this.mai.startingMarkerLng &&
                 pageInitValues.markerLat && pageInitValues.markerLng) {
    jurisdictionMarker =  L.marker([pageInitValues.markerLat, 
                                    pageInitValues.markerLng])
                           .bindPopup("Fetching data, please wait...")
                           .addTo(myMap);
    myMap.pointInfoUrlPrefix = this.mai.pointInfoUrlPrefix;
  }

  var domAppender = new DomElementAppender(myMap, this.mai, pageInitValues);
  if(domAppender.createAndPopulateElements()) { // VALIDATION HAPPENS HERE

    var cityLabeller;
    if(this.mai.citiesUrl && this.mai.cityIconUrl) {
      cityLabeller = new CityLabeller(myMap, 
                     this.mai.citiesUrl, this.mai.cityIconUrl);
    }
  
    var mbc = new MapBehaviorInitializer(myMap, this.mai, cityLabeller, 
                                         jurisdictionMarker);
    mbc.initialize();
  
    var listenerInitializer = 
      new ListenerInitializer(myMap, this.mai, cityLabeller, jurisdictionMarker);
    listenerInitializer.initialize();
  
    if(cityLabeller) {
      cityLabeller.refreshCityLabels(cityLabeller);
    }

  }
};

/** Convenience method to put up an alert if the MAI file was wrong.
 *  @private
 */
Runner.prototype.maiAlert = function() {
   alert("There was a problem with the JSON file "
          + "used to determine the layout and capabilities of this page. "
          + "Either the file doesn't exist, it can't be read, or it has "
          + "a syntax error in it.\n");
}   
