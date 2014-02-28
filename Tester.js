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

  

}
