standardAttributeInfo = {
   "null": {
      "table":"null",
      "fieldName":"null",
      "year":1,
      "minValue":0,
      "maxValue":1,
      "description":"null",
      "source":"",
      "sourceUrl":""
   },
   "unemployment": { 
      "table":"countyAttributes",
      "fieldName":"unemploymentRateAdjustedJan",
      "year":2013,
      "minValue":0,
      "maxValue":17,
      "description":"Jan 2013 Adjusted Unemployment Rate (percent)",
      "source":"US Bureau of Labor Statistics",
      "sourceUrl":"ftp://ftp.bls.gov/pub/time.series/compressed/tape.format/"
   },

   "congressionalDistricts": {
      "table":"countryLowerChamberAttributes",
      "fieldName":"jurisdictionId",
      "year":2012,
      "minValue":0,
      "maxValue":500,
      "description":"Congressional districts",
      "source":"Kaitlin Duck Sherwood",
      "sourceUrl":"ftp://ftp2.census.gov/geo/tiger/TIGER2013/CD/tl_2013_us_cd113.zip"
   },
   "demMargin": {
      "table":"countryLowerChamberAttributes",
      "fieldName":"demMargin",
      "year":2012,
      "minValue":-0.8,
      "maxValue":0.8,
      "description":"House vote margin",
      "source":"Kaitlin Duck Sherwood",
      "sourceUrl":""
   },
   "congressionalDistrictPopulation": {
      "table":"countryLowerChamberAttributes",
      "fieldName":"population",
      "year":2011,
      "minValue":500000,
      "maxValue":1000000,
      "description":"Congressional district population",
      "source":"Kaitlin Duck Sherwood",
      "sourceUrl":""
   },
   "populationPovertyPct": {
      "table":"countryLowerChamberAttributes",
      "fieldName":"populationPovertyPct",
      "year":2011,
      "minValue":4,
      "maxValue":40,
      "description":"Congressional district percent of population under the poverty line",
      "source":"Kaitlin Duck Sherwood",
      "sourceUrl":""
   },
   "stateBorders": {
      "table":"provinceAttributes",
      "fieldName":"jurisdictionId",
      "year":2000,
      "minValue":0,
      "maxValue":70,
      "description":"State borders",
      "source":"Kaitlin Duck Sherwood",
      "sourceUrl":""
   },
   "prez2012": {
      "table":"countyAttributes",
      "fieldName":"demPresidentialMargin",
      "year":2012,
      "minValue":-0.8,
      "maxValue":0.8,
      "description":"Margin of victory in 2004 US Presidential Election",
      "source":"Various",
      "sourceUrl":"http://www.politico.com/2012-election/results/president/maine/"
   },
   "prez2008": {
      "table":"countyAttributes",
      "fieldName":"demPresidentialMargin",
      "year":2008,
      "minValue":-0.8,
      "maxValue":0.8,
      "description":"Margin of victory in 2004 US Presidential Election",
      "source":"Various",
      "sourceUrl":"http://www.politico.com/2012-election/results/president/maine/"
   },
   "countyBorders": {
      "table":"countyAttributes",
      "fieldName":"jurisdictionId",
      "year":2000,
      "minValue":0,
      "maxValue":4000,
      "description":"County borders",
      "source":"Kaitlin Duck Sherwood",
      "sourceUrl":""
   }
}
