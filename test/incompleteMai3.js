/* if missing cartogram table, then don't have a cartogram checkbox */
mapApplicationInfo = {
  'pageTitle' : 'TestSanity pageTitle',
  'pageDescription' : 'TestSanity pageDescription',
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
    }
	

}
