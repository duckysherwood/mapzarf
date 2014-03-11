/* if missing cartogram table, then don"t have a cartogram checkbox */
mapApplicationInfo = {
  "pageTitle" : "TestSanity pageTitle",
  "pageDescription" : "TestSanity pageDescription",
  "pointInfoUrlPrefix" : "./testSanityMarkerInfo.html",
  "startingMarkerLat" : 40,
  "startingMarkerLng" : -100,
  "startingCenterLat" : 38,
  "startingCenterLng" : -95,
  "startingCenterZoom" : 4,
  "hasCartogram" : true,
  "slippyMapFramework" : "leaflet",
  "slippyMapFrameworkVersion" : 1.6,
  "attribution" : "<a href=\"http://webfoot.com/ducky.home.html\">Kaitlin Duck Sherwood</a>",
  "dotLayers" :
    {
       "gunDeaths": {
          "cartogramTable":"dotAttributes",
          "year":2013,
          "size":3,
          "color": "0000ff",
          "shortDescription" : "gun deaths",
          "description": "gun deaths in the 100 days after Sandy Hook",
          "sourceUrl" : "http://data.huffingtonpost.com/2013/03/gun-deaths",
          "source" : "Huffington Post; some geocoding provided by <a href=\"http://geocoder.ca\">GeoCoder.ca</a>"
       }
  }
}
