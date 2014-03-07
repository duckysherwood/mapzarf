/* if missing cartogram table, then don't have a cartogram checkbox */
mapApplicationInfo = {
  'pageTitle' : 'Test1 pageTitle',
  'pageDescription' : 'Test1 pageDescription',
  'pointInfoUrlPrefix' : './test1MarkerInfo.html',
  'startingMarkerLat' : 40,
  'startingMarkerLng' : -100,
  'startingCenterLat' : 38,
  'startingCenterLng' : -95,
  'startingCenterZoom' : 4,
  'hasCartogram' : true,
  'slippyMapFramework' : 'leaflet',
  'slippyMapFrameworkVersion' : 1.6,
  'attribution' : '<a href="http://webfoot.com/ducky.home.html">Kaitlin Duck Sherwood</a>',
  'choroplethLayers' :
    {
       'taxRoiNormalized': { 
          'tileGenerator' : 'mapeteria',
          'tileGeneratorVersion' : 2,
          'table':'provinceAttributes',
          'fieldName':'taxRoiNormalized',
          'year':2005,
          'mercatorShapeType' : 'state', 
          'mercatorPolyYear' : 2006,
          'cartogramShapeType' : 'statePopCartogram',
          'cartogramPolyYear' : 2011,
          'minValue':-1.0,
          'maxValue':1.0,
          'isPercentage' : true,
          'minColor' : '0000ff',
          'maxColor' : 'ff0000',
          'mapping' : 'plusminus',
          'shortDescription' : 'Tax ROI',
          'description':'Excess/Loss Federal Spending in Each State Per Dollar of Federal Taxes',
          'source':'Tax Foundation',
          'sourceUrl':'http://taxfoundation.org/article/federal-spending-received-dollar-taxes-paid-state-2005'
       },
       'populationPovertyPct': {
          'tileGenerator' : 'mapeteria',
          'tileGeneratorVersion' : 2,
          'table':'countryLowerChamberAttributes',
          'fieldName':'populationPovertyPct',
          'mercatorShapeType' : 'congressionalDistrict',  
          'mercatorPolyYear' : 2011, 
          'cartogramShapeType' : 'congressionalDistrictPopCart',
          'cartogramPolyYear' : 2011,
          'year':2011,
          'minValue':5,
          'maxValue':40,
          'minColor' : 'ffffff',
          'maxColor' : 'ff0000',
          'mapping' : 'linear',
          'shortDescription' : 'Poverty Level',
          'description':'Population earning less than the poverty line',
          'source':'US Census Bureau',
          'sourceUrl':'http://www2.census.gov/acs2011_1yr/CD113/EasyStats_113_Congressional_DP.xlsx'
       },
    },
  'borderLayers' :
    {
       'state': {
          'tileGenerator' : 'mapeteria',
          'tileGeneratorVersion' : 2,
          'table':'provinceAttributes',
          'mercatorShapeType' : 'state',
          'mercatorPolyYear' : 2006,
          'cartogramShapeType' : 'statePopCartogram',
          'cartogramPolyYear' : 2011,
          'fieldName':'jurisdictionId',
          'year':2000,
          'mapping' : 'none',
          'borderColor' : '000000',
          'borderWidth' : '2',
          'shortDescription' : 'State',
          'description' : 'State borders',
          'source':'US Census Bureau',
          'sourceUrl':'http://www2.census.gov/acs2011_1yr/CD113/EasyStats_113_Congressional_DP.xlsx'
       },
       'county': {
          'tileGenerator' : 'mapeteria',
          'tileGeneratorVersion' : 2,
          'table':'countyAttributes',
          'mercatorShapeType' : 'county',  
          'mercatorPolyYear' : 2008,
          'cartogramShapeType' : 'countyPopulationCartogram',
          'cartogramPolyYear' : 2011,
          'fieldName':'jurisdictionId',
          'year':2009,
          'mapping' : 'none',
          'borderColor' : '000000',
          'borderWidth' : '1',
          'mapping' : 'none',
          'shortDescription' : 'County',
          'description' : 'County borders',
          'source':'US Census Bureau',
          'sourceUrl':'http://www2.census.gov/acs2011_1yr/CD113/EasyStats_113_Congressional_DP.xlsx'
       }
    },
  'dotLayers' :
    {
       'shutdownSigners': {
          'tileGenerator' : 'mapeteria',
          'tileGeneratorVersion' : 2,
          'mercatorTable':'dotAttributes',
          'mercatorFieldName':'shutdownSigner',
          'cartogramTable':'congressionalDistrictPopCartDotAttributes',
          'cartogramFieldName':'shutdownSignerCart',
          'year':2013,
          'size':3,
          'color': '000005',
          'shortDescription' : "dots for representatives who supported the 2014 US Federal shutdown",
          'description': 'Republican Congressional Representatives who signed a letter supporting shutting down the US Federal government in an attempt to defund Obamacare.',
          'sourceUrl' : 'http://www.freedomworks.org/content/have-your-members-congress-signed-defund-obamacare-letter-find-out-here',
          'source' : 'Freedom Works'
       },
       'shutdownSigners2': {
          'tileGenerator' : 'mapeteria',
          'tileGeneratorVersion' : 2,
          'mercatorTable':'dotAttributes',
          'mercatorFieldName':'shutdownSigner',
          'cartogramTable':'congressionalDistrictPopCartDotAttributes',
          'cartogramFieldName':'shutdownSignerCart',
          'year':2013,
          'size':3,
          'color': '000005',
          'shortDescription' : 'Signers2',
          'description': 'Signers2 description',
          'sourceUrl' : 'http://www.freedomworks.org/content/have-your-members-congress-signed-defund-obamacare-letter-find-out-here',
          'source' : 'Freedom Works'
       }
    }
	

}
