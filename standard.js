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
   "taxRoiNormalized": { 
      "table":"provinceAttributes",
      "fieldName":"taxRoiNormalized",
      "year":2005,
      "minValue":-1.0,
      "maxValue":1.0,
      "description":"Excess/Loss Federal Spending in Each State Per Dollar of Federal Taxes",
      "source":"Tax Foundation",
      "sourceUrl":"http://taxfoundation.org/article/federal-spending-received-dollar-taxes-paid-state-2005"
   },
   "taxRoi": { 
      "table":"provinceAttributes",
      "fieldName":"taxRoi",
      "year":2005,
      "minValue":0.5,
      "maxValue":2.0,
      "description":"Federal Spending in Each State Per Dollar of Federal Taxes",
      "source":"Tax Foundation",
      "sourceUrl":"http://taxfoundation.org/article/federal-spending-received-dollar-taxes-paid-state-2005"
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
   "demMargin": {
      "table":"countryLowerChamberAttributes",
      "fieldName":"demMargin",
      "year":2012,
      "minValue":-0.9,
      "maxValue":0.9,
      "description":"House of Representatives vote margin",
      "source":"US Federal Election Committee",
      "sourceUrl":"http://www.fec.gov/pubrec/fe2012/2012congresults.xls"
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
   "populationPovertyPct": {
      "table":"countryLowerChamberAttributes",
      "fieldName":"populationPovertyPct",
      "year":2011,
      "minValue":5,
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
   "prez2008": {
      "table":"provinceAttributes",
      "fieldName":"obamaMargin",
      "year":2008,
      "minValue":-0.5,
      "maxValue":0.5,
      "description":"Democratic margin of victory in 2008 US Presidential Election",
      "source":"Data from many counties compiled by USA Today, M. E. J. Newman, Kaitlin Duck Sherwood, and Mark Brickly",
      "sourceUrl":"http://www.usatoday.com/news/politics/election2008/president.htm"
   },
   "prez2012": {
      "table":"provinceAttributes",
      "fieldName":"demPresidentialMargin",
      "year":2012,
      "minValue":-0.5,
      "maxValue":0.5,
      "description":"Margin of victory in 2012 US Presidential Election",
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
      "source":"US Census Bureau",
      "sourceUrl":"http://www2.census.gov/acs2011_1yr/CD113/EasyStats_113_Congressional_DP.xlsx"
   }
}
