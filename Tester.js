function Tester()  {
    var exampleMai = {
      'startingCenterLat' : 38.7,
      'startingCenterLng' : -121.7,
      'startingCenterZoom' : 3,
      'hasCartogram' : true,
    }

    var maiToPageInitTranslator = {
      'startingCenterLat' : 'lat',
      'startingCenterLng' : 'lng',
      'startingCenterZoom' : 'zoom',
      'hasCartogram' : 'cartogram',
    }

// This will only work if the query string is null
// TODO how can I better test?
  this.pageInitValuesTest = function () {
  
    var testValues = new MapDisplayParameters(exampleMai)
                       .createDefaultsFromMapApplicationInfo(exampleMai)
  
    var successFlag = true
    $.each(exampleMai, function (key, value) {
      var tKey = maiToPageInitTranslator[key]
      if(value != testValues[tKey][1]) {
        console.log('testValues[' + tKey + '] was ' + testValues[tKey][1]
                    + ', expected ' + value)
        successFlag = false
        return false
      } 
    })
  
    console.log("PageInitValuesTest passed? " + successFlag)
    return successFlag
  }

  this.validateAndUpdateTest = function () {
    var success = false
  }

  this.testCongressionalDistrictInfoMercator = function () {
    var exampleMercatorLocations = {
      'IL-13' : { 'lat' : 40.1, 'lng' : -88.5},
      'CA-20' : { 'lat' : 37, 'lng' : -122},
      'FL-27' : { 'lat' : 25.3, 'lng': -80.2 },
      'WA-8' : { 'lat' : 47.5, 'lng': -121.8 }
    }
    this.testDistrictInfo(exampleMercatorLocations, 'f') 
  }

  this.testCongressionalDistrictInfoCartogram = function () {
    var exampleCartogramLocations = {
      'IL-13' : { 'lat' : 42.27, 'lng' : -98.67},
      'CA-20' : { 'lat' : 38.65, 'lng' : -127.18},
      'FL-27' : { 'lat' : 20.51, 'lng': -80.3 },
      'WA-8' : { 'lat' : 49.0, 'lng': -122.56 }
    }
    this.testDistrictInfo(exampleCartogramLocations, 't') 
  }

  this.testDistrictInfo = function (testData, cartogramFlag) {
    var urlBase = 'http://localhost/maps/demos/congress2012/districtPopupInformation.php?cartogram=' + cartogramFlag
   urlBase += '&zoom=4&fieldName=null&polyYear=2011&year=2011'
   $.each(testData, function (key, value)  {
     var url = urlBase + '&lat=' + value['lat'] + '&lng=' + value['lng']
console.log(url)
     $.get(url, function (data) { 
       var districtFound = data.substring(3,8).replace('<', '')
       if(key != districtFound) {
         console.log('ERROR: expected ' + key + ' and got ' + districtFound)
         console.log(data)
       } else {
         console.log('GOOD!  expected ' + key + ' and got ' + districtFound)
       }
     })

   })
  }




}
