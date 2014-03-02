function ListenerInitializer (map, mapApplicationInfo, 
                              labeller, jurisdictionMarker) {
  this.map = map
  this.mai = mapApplicationInfo
  this.cityLabeller = labeller
  this.jurisdictionMarker = jurisdictionMarker

  this.addLayerControlSelectListener('choroplethLayers') 
  this.addLayerControlSelectListener('borderLayers') 
  this.addLayerControlCheckboxListener('choroplethLayers')
  this.addLayerControlCheckboxListener('borderLayers')
  this.addLayerControlCheckboxListener('dotLayers')
  this.addCitiesCheckboxListener()
  this.addIsCartogramCheckboxListener()
  this.addMapClickListener()
  this.addMarkerClickListener()


  // There isn't an obvious place to put this
  this.updateSharingUrl()
}


ListenerInitializer.prototype.updateSharingUrl = function() {
  $( '#sharingUrl' )[0].href = this.map.getSharingUrl()
}

ListenerInitializer.prototype.addMarkerClickListener = function() {
  var scope = this
  if(this.jurisdictionMarker) {
    this.jurisdictionMarker.on("click", function (e) {
      scope.requestPopupInformation(e)
    })
  }
}

ListenerInitializer.prototype.addLayerControlSelectListener
  = function (layerTypeName) {

  var selectElement = $( '#' + layerTypeName + 'Selector' )[0]
  if((selectElement == null) || (selectElement == undefined)) {
    return null
  }

  // make available to the closure
  var closureLayerTypeName = layerTypeName
  var scope = this

  selectElement.onchange = function () {
    var field = $('option.' + closureLayerTypeName + 'Option:selected').val()
    var elementName = '#' + closureLayerTypeName + 'Description' 
    var description = descriptionHtml(scope.mai[closureLayerTypeName][field])
    $( elementName ).html(descriptionHtml(description))
    scope.map.updateLayers()
    scope.updateSharingUrl()
  }

}

ListenerInitializer.prototype.addLayerControlCheckboxListener
  = function (layerTypeName) {

  var checkboxElement = $( '#' + layerTypeName + 'Checkbox' )[0]
  if((checkboxElement == null) || (checkboxElement == undefined)) {
    return null
  }

  var scope = this
  checkboxElement.onchange = function () {
    scope.map.updateLayers()
    scope.updateSharingUrl()
  }
}

ListenerInitializer.prototype.addCitiesCheckboxListener
  = function () {
  var scope = this
  $('#showCitiesCheckbox')[0].onchange = function() {
    scope.cityLabeller.refreshCityLabels(scope.cityLabeller)
    scope.updateSharingUrl()
  }
}

ListenerInitializer.prototype.addIsCartogramCheckboxListener
  = function () {
  var checkboxElement = $( '#isCartogramCheckbox' )[0]
  if((checkboxElement == null) || (checkboxElement == undefined)) {
    return null
  }

  var scope = this
  checkboxElement.onchange = function () {
    scope.map.updateLayers()
    scope.cityLabeller.refreshCityLabels(scope.cityLabeller)    
    scope.updateSharingUrl()
  }
}

ListenerInitializer.prototype.setPopupInfoCallback = function (responseText) {
  this.jurisdictionMarker.setPopupContent(responseText);
  this.updateSharingUrl() 
}

ListenerInitializer.prototype.requestPopupInformation = function (e) {
    var latlng = e.latlng
    var lat = latlng.lat
    var lng = latlng.lng

    // TODO this piece needs to be split out separately so that
    // I can use it also for clicking on the marker (see addMarkerClickListener,
    // above
    var isCartogramCheckbox = document.getElementById("isCartogramCheckbox");
    var cartogramFlag;

    var layerName = this.map.getLayerName('dotLayers')
    var fieldName, year
    fieldName = layerName ? this.mai['dotLayers'][layerName].fieldName : null
    year = layerName ? this.mai['dotLayers'][layerName].year : null

    var cartogramFlag = this.map.getFlagForCheckbox('#isCartogramCheckbox')

    var url = this.map.pointInfoUrlPrefix + "?" 
       + "lat="+this.map.getCenter().lat+"&lng="+this.map.getCenter().lng
       +"&zoom="+this.map.zoom
       +"&fieldName="+fieldName 
       + "&polyYear=2011&year=2011&cartogram="+cartogramFlag;

    this.jurisdictionMarker.setPopupContent("Looking up congressional district information, please wait...");

    requestUrlWithScope(url, this.setPopupInfoCallback, this);  // request is a verb here
    }

ListenerInitializer.prototype.addMapClickListener = function() {

  var scope = this
  this.map.on("click", function (e) {

    var latlng = e.latlng
    var lat = latlng.lat
    var lng = latlng.lng

console.log("add map click listener!")
    if(scope.jurisdictionMarker) {
      scope.jurisdictionMarker.setLatLng([lat, lng]);
      // @@@ TODO set flag in mapApplicationInfo.js to say whether 
      // popup should open always
      scope.jurisdictionMarker.openPopup();
      scope.requestPopupInformation(e)    
    }
  

  })

}
  









