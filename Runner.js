/** @author Kaitlin Duck Sherwood
 *  @class Runner
 *  @classdesc This class is the entry point for all the other code,
 *    sort of like =main()= in C programs.
 * 
 *  @constructor
 *  @param mapApplicationInfo {object} A JSON object with information 
 *    about how to set up the map.
 */
function Runner(mapApplicationInfo) {
  this.mai = mapApplicationInfo;  
}

/** This is the start of execution, much like =main()= in C programs.
 *  @private
 *  SIDE EFFECT: removes all the city labels from the map
 */
Runner.prototype.main = function () {
  // var tester = new Tester();
  // tester.pageInitValuesTest();
  // tester.testCongressionalDistrictInfoMercator();
  // tester.testCongressionalDistrictInfoCartogram();

  var mapDisplayParameters = new MapDisplayParameters(this.mai);
  var pageInitValues = mapDisplayParameters.getPageValueParameters();


  // L (from Leaflet) is global scope, but we need =map= in this scope
  // so we can pass it to behaviour
  var myMap = L.map("map", {minZoom: 0, maxZoom: 14});

  // jurisdictionMarker needs to be in this scope
  var jurisdictionMarker = null;
  if(this.mai.startingMarkerLat && this.mai.startingMarkerLng 
     && pageInitValues.markerLat && pageInitValues.markerLng) {
    jurisdictionMarker =  L.marker([pageInitValues.markerLat, 
                                    pageInitValues.markerLng])
                           .bindPopup("Fetching data, please wait...")
                           .addTo(myMap);
    myMap.pointInfoUrlPrefix = mapApplicationInfo.pointInfoUrlPrefix;
  }

  var domAppender = new DomElementAppender(myMap, this.mai, pageInitValues);
  domAppender.createAndPopulateElements();

  var cityLabeller = new CityLabeller(myMap);

  var mbc = new MapBehaviorInitializer(myMap, this.mai, cityLabeller, 
                                       jurisdictionMarker);
  mbc.initialize();

  var listenerInitializer = 
    new ListenerInitializer(myMap, this.mai, cityLabeller, jurisdictionMarker);

  cityLabeller.refreshCityLabels(cityLabeller);

};
