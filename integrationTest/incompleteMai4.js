/* if missing cartogram table, then don't have a cartogram checkbox */
mapApplicationInfo = {
  'pageTitle' : 'TestSanity pageTitle',
  'pageDescription' : 'TestSanity pageDescription',
  "attribution" : "Kaitlin Duck Sherwood",
  'choroplethLayers' :
    {
       'taxRoiNormalized': { 
          'tileGenerator' : 'mapeteria',
          'tileGeneratorVersion' : 2,
          'table':'provinceAttributes',
          'fieldName':'taxRoiNormalized',
          'mercatorShapeType' : 'state', 
          'mercatorPolyYear' : 2006,
          'year' : 2005,
          'minValue':-1.0,
          'maxValue':1.0,
          'isPercentage' : true,
          'minColor' : '0000ff',
          'maxColor' : 'ff0000',
          'mapping' : 'plusminus',
          'shortDescription' : 'Tax ROI'
       },
    },
    "dotLayers" :
    {
       "gunDeaths": {
          "mercatorTable":"dotAttributes",
          "mercatorFieldName":"gunDeathCount",
          "year":2013,
          "size":3,
          "color": "0000ff",
       },
    },
    "borderLayers" :
      {
       "state": {
          "tileGenerator" : "mapeteria",
          "tileGeneratorVersion" : 2,
          "table":"provinceAttributes",
          "mercatorShapeType" : "state",
          "mercatorPolyYear" : 2006,
          "fieldName":"jurisdictionId",
          "year":2000,
          "mapping" : "none",
          "borderColor" : "000000",
          "borderWidth" : "2",
          "shortDescription" : "State",
       }
    }
}

