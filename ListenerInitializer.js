function ListenerInitializer (map, mapApplicationInfo, labeller) {
  this.map = map
  this.mai = mapApplicationInfo
  this.cityLabeller = labeller
  // put listeners on the cartogram checkbox

  this.addLayerControlSelectListener('choroplethLayers') 
  this.addLayerControlSelectListener('borderLayers') 
  this.addLayerControlCheckboxListener('choroplethLayers')
  this.addLayerControlCheckboxListener('borderLayers')
  this.addLayerControlCheckboxListener('dotLayers')
  this.addCitiesCheckboxListener()
  this.addIsCartogramCheckboxListener()
}

ListenerInitializer.prototype.addLayerControlSelectListener
  = function (layerTypeName) {

  var selectElement = $( '#' + layerTypeName + 'Select' )[0]
  if((selectElement == null) || (selectElement == undefined)) {
    return null
  }

  // make available to the closure
  var myLayerTypeName = layerTypeName
  var myMap = this.map
  var mai = this.mai

  selectElement.onchange = function () {
    var field = $('option.' + myLayerTypeName + 'Option:selected').val()
    var elementName = '#' + myLayerTypeName + 'Description' 
    $( elementName ).html(descriptionHtml(mai[myLayerTypeName][field]))
    myMap.updateLayers()
  }

}

ListenerInitializer.prototype.addLayerControlCheckboxListener
  = function (layerTypeName) {

  var checkboxElement = $( '#' + layerTypeName + 'Checkbox' )[0]
  if((checkboxElement == null) || (checkboxElement == undefined)) {
    return null
  }

  var myMap = this.map
  checkboxElement.onchange = function () {
    myMap.updateLayers()
  }
}

ListenerInitializer.prototype.addCitiesCheckboxListener
  = function () {
  var labeller = this.cityLabeller
  $('#showCitiesCheckbox')[0].onchange = function() {
    labeller.refreshCityLabels(labeller)
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
  checkboxElement.onchange = function () {
    myMap.updateLayers()
    closureCityLabeller.refreshCityLabels(closureCityLabeller)    
  }
}




