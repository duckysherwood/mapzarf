function ListenerInitializer (map, mapApplicationInfo, 
                              labeller, jurisdictionMarker) {
  this.map = map
  this.mai = mapApplicationInfo
  this.cityLabeller = labeller
  this.marker = jurisdictionMarker

  this.addLayerControlSelectListener('choroplethLayers') 
  this.addLayerControlSelectListener('borderLayers') 
  this.addLayerControlCheckboxListener('choroplethLayers')
  this.addLayerControlCheckboxListener('borderLayers')
  this.addLayerControlCheckboxListener('dotLayers')
  this.addCitiesCheckboxListener()
  this.addIsCartogramCheckboxListener()
  this.addClickListener()

  // There isn't an obvious place to put this
  this.updateSharingUrl()
  
}

ListenerInitializer.prototype.updateSharingUrl = function() {
  $( '#sharingUrl' )[0].href = this.map.getSharingUrl()
}

ListenerInitializer.prototype.addLayerControlSelectListener
  = function (layerTypeName) {

  var selectElement = $( '#' + layerTypeName + 'Selector' )[0]
  if((selectElement == null) || (selectElement == undefined)) {
    return null
  }

  // make available to the closure
  var myLayerTypeName = layerTypeName
  var myMap = this.map
  var mai = this.mai
  var scope = this

  selectElement.onchange = function () {
    var field = $('option.' + myLayerTypeName + 'Option:selected').val()
    var elementName = '#' + myLayerTypeName + 'Description' 
    $( elementName ).html(descriptionHtml(mai[myLayerTypeName][field]))
    myMap.updateLayers()
    scope.updateSharingUrl()
  }

}

ListenerInitializer.prototype.addLayerControlCheckboxListener
  = function (layerTypeName) {

  var checkboxElement = $( '#' + layerTypeName + 'Checkbox' )[0]
  if((checkboxElement == null) || (checkboxElement == undefined)) {
    return null
  }

  var myMap = this.map
  var scope = this
  checkboxElement.onchange = function () {
    myMap.updateLayers()
    scope.updateSharingUrl()
  }
}

ListenerInitializer.prototype.addCitiesCheckboxListener
  = function () {
  var labeller = this.cityLabeller
  var scope = this
  $('#showCitiesCheckbox')[0].onchange = function() {
    labeller.refreshCityLabels(labeller)
    scope.updateSharingUrl()
  }
}

ListenerInitializer.prototype.addIsCartogramCheckboxListener
  = function () {
  var checkboxElement = $( '#isCartogramCheckbox' )[0]
  if((checkboxElement == null) || (checkboxElement == undefined)) {
    return null
  }

  var myMap = this.map
  var closureCityLabeller = this.cityLabeller
  var scope = this
  checkboxElement.onchange = function () {
    myMap.updateLayers()
    closureCityLabeller.refreshCityLabels(closureCityLabeller)    
    scope.updateSharingUrl()
  }

ListenerInitializer.prototype.addClickListener = function() {
  
    var closureMap = this.map
    var closureJurisdictionMarker = this.marker

    var scope = this
    closureMap.on("click", function (e) {
  
      var latlng = e.latlng
      var lat = latlng.lat
      var lng = latlng.lng
  
      var setPopupInfo = function (responseText) {
        closureJurisdictionMarker.setPopupContent(responseText);
        scope.updateSharingUrl()
      }

      if(closureJurisdictionMarker) {
        closureJurisdictionMarker.setLatLng([lat, lng]);
        // @@@ TODO set flag in omni.js to say iff popup should open always
        closureJurisdictionMarker.openPopup();
      }
    
      var isCartogramCheckbox = document.getElementById("isCartogramCheckbox");
      var cartogramFlag;
    
      
      var layerName = closureMap.getLayerName('dotLayers')
      var fieldName, year
      if(layerName) {
        fieldName = closureMai['dotLayers'][layerName].fieldName
        year = closureMai['dotLayers'][layerName].year
      } else {
        fieldName = null
        year =null
      }
      var cartogramFlag = closureMap.getFlagForCheckbox('#isCartogramCheckbox')
    
      var url = closureMap.pointInfoUrlPrefix + "?" +
         "lat="+lat+"&lng="+lng+"&zoom="+map.zoom
         +"&fieldName="+fieldName 
         + "&polyYear=2011&year=2011&cartogram="+cartogramFlag;

      closureJurisdictionMarker.setPopupContent("Looking up congressional district information, please wait...");


      requestUrlWithScope(url, setPopupInfo, this);  // request is a verb here
    })
  }
  
}








