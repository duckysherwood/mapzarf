/** @author Kaitlin Duck Sherwood
 *  @class ListenerInitializer
 *  @classdesc This class sets up the listeners for everything BUT the
 *  mapFacade -- everything in the DOM.  After some internal debate, I put
 *  the listeners for the marker in here instead of in MapBehavior.
 *
 *  @constructor
 *  @this {ListenerInitializer}
 *  @param map {object} Leaflet map object, e.g. L.map
 *  @param mapApplicationInfo {object} JSON describing the application,
 *    especially the layers to go on the map
 *  @param pageInitValues {object} Information on how to set the UI controls
 *    on startup
 */
// TODO someday add links to social media sites like FB, Twitter, etc
function ListenerInitializer(mapFacade, mapApplicationInfo, labeller) {
  /* @private */ this.mapFacade = mapFacade;
  /* @private */ this.mai = mapApplicationInfo;
  /* @private */ this.cityLabeller = labeller;

}

/** Adds all of the listeners to the page.
 *  SIDE EFFECT: adds listeners
 *  @public
 */
ListenerInitializer.prototype.initialize = function() {
  var scope = this;
  var layersetNames = DomFacade.getLayersetNames();
  $.each(layersetNames, function(index, value) {
    scope.addLayerControlSelectListener(value);
    scope.addLayerControlCheckboxListener(value);
  });

  this.addCitiesCheckboxListener();
  this.addIsCartogramCheckboxListener();
  this.addMapMovementListeners();
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
  var url = DomUtils.getSharingUrl(this.mapFacade)
  DomFacade.setSharingUrl(url);
};

// TODO move to MapFacade
/** Enables clicking on the marker to get info about the dot
 *  or jurisdiction at that point.  (It gets the information from
 *  mapApplicationInfo.pointInfoUrl.)
 *  No arguments, no return.   Calls the {marker} callback.
 *  SIDE EFFECTS: changes the DOM.
 *  @private
 */
ListenerInitializer.prototype.addMarkerClickListener = function() {
  var scope = this;
  callback = function(e) {
    scope.requestPopupInformation(e);
  };

  this.mapFacade.addMarkerClickListener(callback);
};

/** Enables changing a combo box (aka select elements) to select
 *  which layer is displayed on the map.
 *  @param layersetName {string} The name of the layerset e.g. 'dotLayers'
 *  @private
 */
ListenerInitializer.prototype.addLayerControlSelectListener =
  function(layersetName) {

  var selectElement = DomFacade.getSelectorForLayersetName(layersetName);
  if (!selectElement) {
    return null;
  }

  var scope = this;
  selectElement.onchange = function() {
    var layerName = DomFacade.getSelectedLayerNameForLayerset(layersetName);
    var description =
        Utilities.descriptionHtml(scope.mai[layersetName][layerName]);
    DomFacade.setLayerSpecDescription(layersetName, description);
    scope.mapFacade.updateLayers();
    scope.updateSharingUrl();
  };

};

/** Enables changing whether a layer is shown or hidden on the map.
 *  @param layersetName {string} The name of the layerset e.g. 'dotLayers'
 *  @private
 */
ListenerInitializer.prototype.addLayerControlCheckboxListener =
  function(layersetName) {

  var checkbox = DomFacade.getCheckboxForLayerset(layersetName);

  var scope = this;
  checkbox.onchange = function() {
    scope.mapFacade.updateLayers();
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
    var closureCityLabeller = this.cityLabeller;
    DomFacade.getCityCheckbox().onchange = function () {
      console.log("City checkbox clicked!");
      closureCityLabeller.refreshCityLabels(closureCityLabeller);
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
  var cartogramCheckboxElement = DomFacade.getCartogramCheckbox();
  if(!cartogramCheckboxElement) {
    return null;
  }

  var scope = this;
  var closureCityLabeller = this.cityLabeller;
  DomFacade.getCartogramCheckbox().onchange = function () {
    scope.mapFacade.updateLayers();
    closureCityLabeller.refreshCityLabels(closureCityLabeller);
    scope.updateSharingUrl();
  }
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
  this.mapFacade.setPopupContent(responseText);
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

  var layersetNames = DomFacade.getVisibleLayersetNames().reverse();
  var layerSpecName, layerSpec, tileEngineClass, url;
  var scope = this;
  $.each(layersetNames, function(index, layersetName) {
    layerSpecName = DomUtils.findSelectedKeyForLayerType(layersetName);
    if (layersetName && layerSpecName) {
      layerSpec = scope.mai[layersetName][layerSpecName];
      tileEngineClass = Validator.classForTileType(layerSpec.tileEngine);
      if(!tileEngineClass) {
        return true;  // go to next iteration of each
      }
      url = tileEngineClass.getPointInfoUrl(layerSpec);
      if(url) {
      
        url += 'lat=' + lat + '&lng=' + lng +
               '&zoom=' + scope.mapFacade.getZoom() ;
        console.log(url);
  
        scope.mapFacade.
          setPopupContent('Looking up jurisdiction information, please wait...');
    
        // request is a verb here
        Utilities.requestUrlWithScope(url, scope.setPopupInfoCallback, scope);
        return false;  // stop the each loop
      }
    }
  });
  
};

/** Event handler for clicking on the map.  The action mostly happens
 *  in this.requestPopupInformation.
 *  @param myException {event} The event triggering the request (named something
      besides 'e' to make debugging a little easier)
 *  SIDE EFFECT: adds listener
 *  @private
 */
ListenerInitializer.prototype.addMapClickListener = function() {
  var scope = this;
  this.mapFacade.addMapClickListener( function(myException) {
    var latlng = myException.latlng;
    var lat = latlng.lat;
    var lng = latlng.lng;

    scope.mapFacade.setJurisdictionMarkerLatLng(lat, lng);
    scope.mapFacade.openPopup();
    scope.requestPopupInformation(myException);
  });
};


/** Event handler for refreshing the city labels and sharing URL when
 *  the user moves the map.
 *  SIDE EFFECT: adds listeners
 *  @private
 */
ListenerInitializer.prototype.addMapMovementListeners = function() {
  // Refreshes the city labels and sharing URL when the user moves the map.
  var scope = this.mapFacade;
  var closureCityLabeller = this.cityLabeller;
  this.mapFacade.addMapZoomEndListener(function() {
    if (closureCityLabeller) {
      scope.removeAllCityLabels();
      closureCityLabeller.refreshCityLabels(closureCityLabeller);
    }
    var url = DomUtils.getSharingUrl(scope)
    DomFacade.setSharingUrl(url);
  });

  // Refreshes the city labels and sharing URL when the user moves the map.
  this.mapFacade.addMapDragEndListener(function(myException) {
    if (closureCityLabeller) {
      scope.removeAllCityLabels();
      closureCityLabeller.refreshCityLabels(closureCityLabeller);
    }
    var url = DomUtils.getSharingUrl(scope)
    DomFacade.setSharingUrl(url);
  });
};

