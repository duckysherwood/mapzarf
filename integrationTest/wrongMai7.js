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
  "attribution" : "Kaitlin Duck Sherwood",
  "choroplethLayers" :
    {
       "taxRoiNormalized": { 
          "tileGenerator" : "mapeteria",
          "tileGeneratorVersion" : 2,
          "table":"provinceAttributes",
          "fieldName":"taxRoiNormalized",
          "year":2005,
          "minValue":-1.0,
          "maxValue":1.0,
          "isPercentage" : true,
          "minColor" : "0000ff",
          "maxColor" : "ff0000",
          "mapping" : "plusminus",
          "shortDescription" : "Tax ROI",
          "description":"Excess/Loss Federal Spending in Each State Per Dollar of Federal Taxes",
          "source":"Tax Foundation",
          "sourceUrl":"http://taxfoundation.org/article/federal-spending-received-dollar-taxes-paid-state-2005"
       },
    }

}