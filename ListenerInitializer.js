function ListenerInitializer (map, mapApplicationInfo, labeller) {
  this.map = map
  this.mai = mapApplicationInfo
  this.cityLabeller = labeller

  this.addLayerControlSelectListener('choroplethLayers') 
  this.addLayerControlSelectListener('borderLayers') 
  this.addLayerControlCheckboxListener('choroplethLayers')
  this.addLayerControlCheckboxListener('borderLayers')
  this.addLayerControlCheckboxListener('dotLayers')
  this.addCitiesCheckboxListener()
  this.addIsCartogramCheckboxListener()

  // There isn't an obvious place to put this; it needs
  // to happen *after* 
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
}








