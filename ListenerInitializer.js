/** @author Kaitlin Duck Sherwood
 *  @class ListenerInitializer
 *  @classdesc This class sets up all the listeners for the map.
 * 
 *  @constructor
 *  @this {ListenerInitializer}
 *  @param map {object} Leaflet map object, e.g. L.map
 *  @param mapApplicationInfo {object} JSON describing the application,
 *    especially the layers to go on the map
 *  @param pageInitValues {object} Information on how to set the UI controls
 *    on startup
 *  @param jurisdictionMarker {object} A Leaflet marker
 */
// TODO instead of adding all these listeners to the map, make a 
// TODO Facade element instead
function ListenerInitializer (map, mapApplicationInfo, 
                              labeller, jurisdictionMarker) {
  this.map = map
  this.mai = mapApplicationInfo
  this.cityLabeller = labeller
  this.jurisdictionMarker = jurisdictionMarker

  this.addLayerControlSelectListener('choroplethLayers') 
  this.addLayerControlSelectListener('borderLayers') 
  this.addLayerControlSelectListener('dotLayers') 
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
    var layer = $('option.' + closureLayerTypeName + 'Option:selected').val()
    var elementName = '#' + closureLayerTypeName + 'Description' 
    var description = descriptionHtml(scope.mai[closureLayerTypeName][layer])
    $( elementName ).html(description)
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
    var cartogramFlag = this.map.getFlagForCheckbox('#isCartogramCheckbox')

    var layerTypeName = this.map.getLayerName('dotLayers');
    var fieldName, year;
    var projectionSelector = cartogramFlag == 't'
      ? 'cartogramFieldName' : 'mercatorFieldName';
    fieldName = layerTypeName 
      ? this.mai['dotLayers'][layerTypeName][projectionSelector] : null
    year = layerTypeName ? this.mai['dotLayers'][layerTypeName].year : null


    var url = this.map.pointInfoUrlPrefix + "?" 
       + "lat="+lat+"&lng="+lng
       +"&zoom="+this.map.getZoom()
       +"&fieldName="+fieldName 
       + "&polyYear=2011&year=2011&cartogram="+cartogramFlag;
console.log(url)

    this.jurisdictionMarker.setPopupContent("Looking up jurisdiction information, please wait...");

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
  









