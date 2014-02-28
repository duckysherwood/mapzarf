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

  // L (from Leaflet) is global scope, but we need =map= in this scope
  // so we can pass it to behaviour
  var myMap = L.map("map", {minZoom: 0, maxZoom: 14})

  var domCreator = new DomCreator(myMap, this.mai, pageInitValues)
  domCreator.createAndPopulateElements()

  var cityLabeller = new CityLabeller($( '#map' )[0], myMap)

  var mbc = new MapBehaviorInitializer(myMap, this.mai, cityLabeller)
  mbc.initialize()

  var listenerInitializer = 
    new ListenerInitializer(myMap, this.mai, cityLabeller)

  cityLabeller.refreshCityLabels(cityLabeller)

}
