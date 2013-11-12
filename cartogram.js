cartogramAttributeInfo = {
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

   "shutdownSigner": {
      "table":"countryLowerChamberAttributes",
      "fieldName":"shutdownSigner",
      "year":2013,
      "minValue":0,
      "maxValue":1,
      "description":"Representatives supporting the 2013 federal shutdown",
      "source":"Freedom Works",
      "sourceUrl":"http://www.freedomworks.org/blog/jwithrow/does-your-senator-stand-with-mike-lee-against-obam"
   },
   "jurisdictionId": {
      "table":"countryLowerChamberAttributes",
      "fieldName":"jurisdictionId",
      "year":2011,
      "minValue":0,
      "maxValue":450,
      "description":"Jurisdiction ID",
      "source":"Kaitlin Duck Sherwood",
      "sourceUrl":"ftp://ftp2.census.gov/geo/tiger/TIGER2013/CD/tl_2013_us_cd113.zip"
   },
   "stateInt": {
      "table":"countryLowerChamberAttributes",
      "fieldName":"stateInt",
      "year":2011,
      "minValue":0,
      "maxValue":65,
      "description":"State FIPS code",
      "source":"ANSI",
      "sourceUrl":"http://www.bls.gov/lau/lausfips.htm"
   },
   "demMargin": {
      "table":"countryLowerChamberAttributes",
      "fieldName":"demMargin",
      "year":2012,
      "minValue":-0.8,
      "maxValue":0.8,
      "description":"House vote margin",
      "source":"US Federal Election Committee",
      "sourceUrl":"http://www.fec.gov/pubrec/fe2012/2012congresults.xls"
   },
   "whitePop": {
      "table":"countryLowerChamberAttributes",
      "fieldName":"whitePop",
      "year":2011,
      "minValue":120779,
      "maxValue":891294,
      "description":"White population",
      "source":"US Census Bureau",
      "sourceUrl":"http://www2.census.gov/acs2011_1yr/CD113/EasyStats_113_Congressional_DP.xlsx"
   },
   "population": {
      "table":"countryLowerChamberAttributes",
      "fieldName":"population",
      "year":2011,
      "minValue":524097,
      "maxValue":998199,
      "description":"Total population",
      "source":"US Census Bureau",
      "sourceUrl":"http://www2.census.gov/acs2011_1yr/CD113/EasyStats_113_Congressional_DP.xlsx"
   },
   "noIns": {
      "table":"countryLowerChamberAttributes",
      "fieldName":"civiliansNoHealthIns",
      "year":2011,
      "minValue":20455,
      "maxValue":271443,
      "description":"Number of non-institutionalized civilians without health insurance",
      "source":"US Census Bureau",
      "sourceUrl":"http://www2.census.gov/acs2011_1yr/CD113/EasyStats_113_Congressional_DP.xlsx"
   },
   "civilians": {
      "table":"countryLowerChamberAttributes",
      "fieldName":"civilianNonInstitutionalized",
      "year":2011,
      "minValue":516672,
      "maxValue":983214,
      "description":"Number of non-institutionalized civilians",
      "source":"US Census Bureau",
      "sourceUrl":"http://www2.census.gov/acs2011_1yr/CD113/EasyStats_113_Congressional_DP.xlsx"
   },
   "populationPovertyPct": {
      "table":"countryLowerChamberAttributes",
      "fieldName":"populationPovertyPct",
      "year":2011,
      "minValue":4,
      "maxValue":40,
      "description":"Population earning less than the poverty line",
      "source":"US Census Bureau",
      "sourceUrl":"http://www2.census.gov/acs2011_1yr/CD113/EasyStats_113_Congressional_DP.xlsx"
   },
   "stateBorders": {
      "table":"provinceAttributes",
      "fieldName":"jurisdictionId",
      "year":2000,
      "minValue":0,
      "maxValue":70,
      "description":"State borders",
      "source":"US Census Bureau",
      "sourceUrl":"http://www2.census.gov/acs2011_1yr/CD113/EasyStats_113_Congressional_DP.xlsx"
   },
   "prez2012": {
      "table":"countyAttributes",
      "fieldName":"demPresidentialMargin",
      "year":2012,
      "minValue":-0.8,
      "maxValue":0.8,
      "description":"Margin of victory in 2012 US Presidential Election",
      "source":"Various",
      "sourceUrl":"http://www.politico.com/2012-election/results/president/maine/"
   },
   "prez2008": {
      "table":"countyAttributes",
      "fieldName":"demPresidentialMargin",
      "year":2008,
      "minValue":-0.8,
      "maxValue":0.8,
      "description":"Margin of victory in 2008 US Presidential Election",
      "source":"Various",
      "sourceUrl":"http://www.politico.com/2012-election/results/president/maine/"
   },
   "districtBorders": {
      "table":"countryLowerChamberAttributes",
      "fieldName":"jurisdictionId",
      "year":2000,
      "minValue":0,
      "maxValue":66000,
      "description":"Congressional district borders",
      "source":"US Census Bureau",
      "sourceUrl":"http://www2.census.gov/acs2011_1yr/CD113/EasyStats_113_Congressional_DP.xlsx"
   },
   "countyBorders": {
      "table":"countyAttributes",
      "fieldName":"jurisdictionId",
      "year":2000,
      "minValue":0,
      "maxValue":4000,
      "description":"County borders",
      "source":"US Census Bureau",
      "sourceUrl":"http://www2.census.gov/acs2011_1yr/CD113/EasyStats_113_Congressional_DP.xlsx"
   }
}
