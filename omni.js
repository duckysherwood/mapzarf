/* This file gives the information about a mapping web app, including
 *  which choropleth layers to show, 
 *  which dot layers to show, 
 *  whether there is cartogram information, 
 *  what the starting lat/lng should be, 
 *  what the colour mapping should be
 */

/* Choropleth layer defaults:
  isPercentage=false, 
  normalizerType='n', 
  normalizerFieldName="dont-care",
  normalizerYear="dont-care",
  timeSeries=constant
  graphPrefix=don't-care; jurisdictionId appended to get the URL
*/

/* timeSeries could have { 
  'unit' : 'month', 
  'startingYear' : 1992,
  'endingYear' : 2014,
  'startingMonth' : 1,	// 1-based index
  'endingMonth' : 5,	// 1-based index
  }
*/
 

/* if missing cartogram table, then don't have a cartogram checkbox */
mapApplicationInfo = {
  'pageTitle' : 'Federal Spending Per Tax Dollar',
  'pageDescription' : 'This shows the change in the tax dollars spent vs. sent by each state.  If there was $1.50 of spending in a state for each $1.00 in taxes raised from that state, it will show as -50%.',
  'jurisdictionInfoUrl' : '',  // e.g. ./countyPopupInformation.php
  'startingCenterLat' : 38,
  'startingCenterLng' : -95,
  'startingCenterZoom' : 4,
  'hasCartogram' : true,
  'choroplethLayers' :
    {
       'taxRoiNormalized': { 
          'table':'provinceAttributes',
          'fieldName':'taxRoiNormalized',
          'year':2005,
          'mercatorShapeType' : 'state', 
          'mercatorPolyYear' : 2006,
          'cartogramShapeType' : 'statePopCartogram',
          'cartogramPolyYear' : 2011,
          'minValue':-1.0,
          'maxValue':1.0,
          'minColor' : '0000ff',
          'maxColor' : 'ff0000',
          'mapping' : 'plusminus',
          'shortDescription' : 'Tax ROI',
          'description':'Excess/Loss Federal Spending in Each State Per Dollar of Federal Taxes',
          'source':'Tax Foundation',
          'sourceUrl':'http://taxfoundation.org/article/federal-spending-received-dollar-taxes-paid-state-2005'
       },
       'populationPovertyPct': {
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
       'prez2012': {
          'table':'provinceAttributes',
          'fieldName':'demPresidentialMargin',
          'year':2012,
          'mercatorShapeType' : 'state', 
          'mercatorPolyYear' : 2006,
          'cartogramShapeType' : 'statePopCartogram',
          'cartogramPolyYear' : 2011,
          'minValue':-0.5,
          'maxValue':0.5,
          'minColor' : 'ff0000',
          'maxColor' : '0000ff',
          'mapping': 'plusminus',
          'shortDescription' : 'Obama-Romney Election',
          'description':'Democratic margin of victory in 2012 US Presidential Election',
          'source':'Various',
          'sourceUrl':'http://www.politico.com/2012-election/results/president/maine/'
       },
       'prez2008': {
          'table':'provinceAttributes',
          'fieldName':'obamaMargin',
          'year':2008,
          'mercatorShapeType' : 'state',
          'mercatorPolyYear' : 2006,
          'cartogramShapeType' : 'statePopCartogram',
          'cartogramPolyYear' : 2011,
          'minValue':-0.5,
          'maxValue':0.5,
          'minColor' : 'ff0000',
          'maxColor' : '0000ff',
          'mapping': 'plusminus',
          'shortDescription' : 'Obama-McCain Election',
          'description':'Democratic margin of victory in 2008 US Presidential Election',
          'source':'Data from many counties compiled by USA Today, M. E. J. Newman, Kaitlin Duck Sherwood, and Mark Brickly',
          'sourceUrl':'http://www.usatoday.com/news/politics/election2008/president.htm'
       },
    },
  'borderLayers' :
    {
       'state': {
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
       }
    }
	

}
