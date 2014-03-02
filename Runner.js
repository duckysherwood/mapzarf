// This class is what runs the whole thing; sort of like 'main'
// in C programs
function Runner(mapApplicationInfo) {
  this.mai = mapApplicationInfo
}

Runner.prototype.main = function () {
  var tester = new Tester()

  var mapDisplayParameters = new MapDisplayParameters()
  var ignoreThis = mapDisplayParameters
        .createDefaultsFromMapApplicationInfo(this.mai)
  var queryString = mapDisplayParameters.getQueryString()
  ignoreThis = mapDisplayParameters
        .initializePageParametersFromQueryString(queryString)
  var pageInitValues = mapDisplayParameters.getValues()

  // tester.pageInitValuesTest()
  // tester.testCongressionalDistrictInfoMercator()
  // tester.testCongressionalDistrictInfoCartogram()

  // L (from Leaflet) is global scope, but we need =map= in this scope
  // so we can pass it to behaviour
  var myMap = L.map("map", {minZoom: 0, maxZoom: 14})

  // jurisdictionMarker needs to be in this scope
  var jurisdictionMarker = null
  if(this.mai.startingMarkerLat && this.mai.startingMarkerLng 
     && pageInitValues.markerLat && pageInitValues.markerLng) {
    jurisdictionMarker =  L.marker([pageInitValues.markerLat, 
                                    pageInitValues.markerLng])
                           .bindPopup("Fetching data, please wait...")
                           .addTo(myMap)
    myMap.pointInfoUrlPrefix = mapApplicationInfo.pointInfoUrl
  }

  var domCreator = new DomCreator(myMap, this.mai, pageInitValues)
  domCreator.createAndPopulateElements()

  var cityLabeller = new CityLabeller($( '#map' )[0], myMap)

  var mbc = new MapBehaviorInitializer(myMap, this.mai, cityLabeller, 
                                       jurisdictionMarker)
  mbc.initialize()

  var listenerInitializer = 
    new ListenerInitializer(myMap, this.mai, cityLabeller, jurisdictionMarker)

  cityLabeller.refreshCityLabels(cityLabeller)

}
