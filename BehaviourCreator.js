// BehaviourCreator adds behaviour to everything, including the map
function BehaviourCreator(aMap, mapApplicationInfo) {
  this.mai = mapApplicationInfo
  this.map = aMap
  map.mai = mapApplicationInfo
  this.getPolygonLayer()  // @@@ testing only TODO
  this.getDotLayer()  // @@@ testing only TODO
  this.getBorderLayer()  // @@@ testing only TODO
}

// Want to add behaviour to the leaflet map, including
// change to cartogram
// change dot layer
// change polygon layer
// change city markers
BehaviourCreator.prototype.changeDotLayer = function () {
  // TODO put in error checks
}

// @@@ think about checking to make sure the currently displayed
// @@@ map layer and the desired map layer are not the same, so we
// @@@ don't refresh the map unneededly

BehaviourCreator.prototype.getDotLayer = function () {
    var layerTypeName = 'dotLayers'
    var key = this.findSelectedKeyForLayerType(layerTypeName)
    var layerSpec = this.mai[layerTypeName][key] 
    console.log(layerTypeName + ' / ' + layerSpec.mercatorFieldName)
}

BehaviourCreator.prototype.getPolygonLayer = function () {
    var layerTypeName = 'polygonLayers'
    var key = this.findSelectedKeyForLayerType(layerTypeName)
    var layerSpec = this.mai[layerTypeName][key] 
    console.log(layerTypeName + ' / ' + layerSpec.fieldName)
}

BehaviourCreator.prototype.getBorderLayer = function () {
    var layerTypeName = 'borderLayers'
    var key = this.findSelectedKeyForLayerType(layerTypeName)
    var layerSpec = this.mai[layerTypeName][key] 
    console.log(layerTypeName + ' / ' + layerSpec.fieldName)
}

BehaviourCreator.prototype.findSelectedKeyForLayerType  = function (layerTypeName) {
  var checkboxId = '#' + layerTypeName + 'Checkbox'
  if($( checkboxId ).is(':checked')) {
    var key = $( checkboxId ).val()

    if(key == SENTINEL_MULTIPLE) {
      // multiple options, select the one which is checked
      var layerSelectorId = '#' + layerTypeName + 'Select'
      key = $( layerSelectorId ).find(':selected').val()
    } 
    return key
  }
}
