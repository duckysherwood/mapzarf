function ListenerInitializer (map, mapApplicationInfo) {
  this.map = map
  this.mai = mapApplicationInfo
  // put listeners on the layer checkboxes
  // put listeners on the layer checkbox
  // put listeners on the cartogram checkbox
  // put listeners on the city names checkbox
  this.addLayerControlSelectListener('choroplethLayers') // @@@ testing
  this.addLayerControlSelectListener('borderLayers') // @@@ testing

}

ListenerInitializer.prototype.addLayerControlSelectListener
  = function (layerTypeName) {


  selectElement = $( '#' + layerTypeName + 'Select' )[0]
  if((selectElement == null) || (selectElement == undefined)) {
    return null
  }

  // make available to the closure
  var myLayerTypeName = layerTypeName
  var mai = this.mai

  selectElement.onchange = function () {
    var field = $('option.' + myLayerTypeName + 'Option:selected').val()
    var elementName = '#' + myLayerTypeName + 'Description' 
    $( elementName ).html(mai[myLayerTypeName][field].description)
  }

}

