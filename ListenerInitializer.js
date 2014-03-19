/** @author Kaitlin Duck Sherwood
 *  @class ListenerInitializer
 *  @classdesc This class sets up the listeners for everything BUT the
 *  map -- everything in the DOM.  After some internal debate, I put
 *  the listeners for the marker in here instead of in MapBehavior.
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
// TODO instead of adding all these listeners directly to the map, make a
// TODO Facade element instead
// TODO someday add links to social media sites like FB, Twitter, etc
function ListenerInitializer(map, mapApplicationInfo,
                              labeller, jurisdictionMarker) {
  /* @private */ this.map = map;
  /* @private */ this.mai = mapApplicationInfo;
  /* @private */ this.cityLabeller = labeller;
  /* @private */ this.jurisdictionMarker = jurisdictionMarker;

}

ListenerInitializer.prototype.initialize = function() {
  var scope = this;
  var layersetNames = DomFacade.getLayersetNames();
  $.each(layersetNames, function(index, value) {
    scope.addLayerControlSelectListener(value);
    scope.addLayerControlCheckboxListener(value);
  });

  this.addCitiesCheckboxListener();
  this.addIsCartogramCheckboxListener();
  this.addMapClickListener();
  this.addMarkerClickListener();


  // There isn't an obvious place to put this, alas.
  this.updateSharingUrl();
};


/** Updates the shareable link
 *  No arguments, no return.
 *  SIDE EFFECTS: changes the DOM.
 *  @private
 */
ListenerInitializer.prototype.updateSharingUrl = function() {
  $('#sharingUrl')[0].href = this.map.getSharingUrl();
};

/** Enables clicking on the marker to get info about the dot
 *  or jurisdiction at that point.  (It gets the information from
 *  mapApplicationInfo.pointInfoUrl.)
 *  No arguments, no return.   Calls the {marker} callback.
 *  SIDE EFFECTS: changes the DOM.
 *  @private
 */
ListenerInitializer.prototype.addMarkerClickListener = function() {
  var scope = this;
  if (this.jurisdictionMarker) {
    this.jurisdictionMarker.on('click', function(e) {
      scope.requestPopupInformation(e);
    });
  }
};

/** Enables changing a combo box (aka select elements) to select
 *  which layer is displayed on the map.
 *  @param layersetName {string} The name of the layerset e.g. 'dotLayers'
 *  @private
 */
ListenerInitializer.prototype.addLayerControlSelectListener =
  function(layersetName) {

  var selectElement = $('#' + layersetName + 'Selector')[0];
  if (!selectElement) {
    return null;
  }

  // make available to the closure
  var closureLayersetName = layersetName;
  var scope = this;

  /** @private */
  selectElement.onchange = function() {
    var layer = $('option.' + closureLayersetName + 'Option:selected').val();
    var elementName = '#' + closureLayersetName + 'Description';
    var description =
        Utilities.descriptionHtml(scope.mai[closureLayersetName][layer]);
    $(elementName).html(description);
    scope.map.updateLayers();
    scope.updateSharingUrl();
  };

};

/** Enables changing whether a layer is shown or hidden on the map.
 *  @param layersetName {string} The name of the layerset e.g. 'dotLayers'
 *  @private
 */
ListenerInitializer.prototype.addLayerControlCheckboxListener =
  function(layersetName) {

  /** @private */
  var checkboxElement = $('#' + layersetName + 'Checkbox')[0];
  if (!checkboxElement) {
    return null;
  }

  var scope = this;
  /** @private */
  checkboxElement.onchange = function() {
    scope.map.updateLayers();
    scope.updateSharingUrl();
  };
};

/** Enables changing whether the locations of cities are shown or hidden on
 *  the map.
 *  @private
 */
ListenerInitializer.prototype.addCitiesCheckboxListener =
  function() {
  var scope = this;
  if (this.cityLabeller) {
    $('#showCitiesCheckbox')[0].onchange = function() {
      scope.cityLabeller.refreshCityLabels(scope.cityLabeller);
      scope.updateSharingUrl();
    };
  }
};

/** Enables changing whether the map shows a mercator projection or
 *  a cartogram.
 *  @private
 */
ListenerInitializer.prototype.addIsCartogramCheckboxListener =
  function() {
  var cartogramCheckboxElement = $('#isCartogramCheckbox')[0];
  if (!cartogramCheckboxElement) {
    return null;
  }

  var scope = this;
  /** @private */
  cartogramCheckboxElement.onchange = function() {
    scope.map.updateLayers();
    if (scope.cityLabeller) {
      scope.cityLabeller.refreshCityLabels(scope.cityLabeller);
    }
    scope.updateSharingUrl();
  };
};

/** Helper for responding to a click on the map or marker.  Sets the
 *  infowindow's content and also updates the sharing URL.  Clicking
 *  on the marker doesn't change the sharing URL, but it's lightweight
 *  to update the sharing URL and doesn't hurt anything.  It would be more
 *  work to inhibit updating the sharing URL if the event came from the marker.
 *  @callback setPopupInfoCallback
 *  @param responseText
 *  @private
 *  SIDE EFFECTS: changes the DOM's sharing URL and the map's infowindow
 */
ListenerInitializer.prototype.setPopupInfoCallback = function(responseText) {
  this.jurisdictionMarker.setPopupContent(responseText);
  this.updateSharingUrl();
};

/** Event handler for clicking on the map or marker.  Kicks off a request
 *  to the server for content to fill the infowindow with.  Note that
 *  the URL for the call to the server is constructed with
 *  pointInfoUrl as specified in the JSON mapApplicationInfo file.
 *  The server gets information about where the user clicked, but after
 *  that, it's all the server's job to figure out what to populate the
 *  infowindow with.
 *  @param e {event} The event triggering the request (a click on the
      map or marker)
 *  @private
 *  @callback marker
 */
ListenerInitializer.prototype.requestPopupInformation = function(e) {
  var latlng = e.latlng;
  var lat = latlng.lat;
  var lng = latlng.lng;

  var cartogramFlag = this.map.getFlagForCheckbox('#isCartogramCheckbox');

  var layersetName = this.map.findSelectedKeyForLayerType('dotLayers');
  var fieldName, year;
  var projectionSelector = cartogramFlag == 't' ?
    'cartogramFieldName' : 'mercatorFieldName';
  fieldName = layersetName ?
    this.mai.dotLayers[layersetName][projectionSelector] : null;
  year = layersetName ? this.mai.dotLayers[layersetName].year : null;


  var url = this.map.pointInfoUrl +
     'lat=' + lat + '&lng=' + lng +
     '&zoom=' + this.map.getZoom() +
     '&fieldName=' + fieldName +
     '&polyYear=2011&year=2011&cartogram=' + cartogramFlag;

  // console.log(url);

  this.jurisdictionMarker.
    setPopupContent('Looking up jurisdiction information, please wait...');

  // request is a verb here
  Utilities.requestUrlWithScope(url, this.setPopupInfoCallback, this);
};

/**
 * Calles the {marker} callback
 * SIDE EFFECTS: directly and indirectly changes the infowindow, indirectly
 * changes the sharing URL
 * @private
 */
ListenerInitializer.prototype.addMapClickListener = function() {

  var scope = this;
  this.map.on('click', function(e) {

    var latlng = e.latlng;
    var lat = latlng.lat;
    var lng = latlng.lng;

    if (scope.jurisdictionMarker) {
      scope.jurisdictionMarker.setLatLng([lat, lng]);
      // @@@ TODO set flag in mapApplicationInfo.js to say whether
      // popup should open always
      scope.jurisdictionMarker.openPopup();
      scope.requestPopupInformation(e);
    }
  });

};









