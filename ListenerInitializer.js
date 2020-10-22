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
  this.addGraphClickListener();

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
    scope.handleClick(e);
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

  var scopeUpdateLayers = function() {
    scope.mapFacade.updateLayers();
    scope.updateSharingUrl();
  }
  var changeDateHelper = function(currentDayString) {
    // set the controls
    DomFacade.setCurrentDayElement(currentDayString);
    // make sure that we aren't past the limits
    updateDayControls(currentDayString, scope.mai.startDay, scope.mai.endDay, scope.mai);
    // refresh the map
    scopeUpdateLayers();
  }

          // TODO check to see if the buttons are there
  var prevDayButton = DomFacade.getPreviousDayButton();
  var nextDayButton = DomFacade.getNextDayButton();
  var prevWeekButton = DomFacade.getPreviousWeekButton();
  var nextWeekButton = DomFacade.getNextWeekButton();
  prevDayButton.onclick = function() {
    var prevDayString = getPreviousDayString();
    changeDateHelper(prevDayString);
  }
  nextDayButton.onclick = function() {
    var nextDayString = getNextDayString();
    changeDateHelper(nextDayString);
  }
  prevWeekButton.onclick = function() {
    var prevWeekString = getPreviousWeekString();
    changeDateHelper(prevWeekString);
  }
  nextWeekButton.onclick = function() {
    var nextWeekString = getNextWeekString();
    changeDateHelper(nextWeekString);
  }

  selectElement.onchange = function() {
    var layerName = DomFacade.getSelectedLayerNameForLayerset(layersetName);
    var description =
        Utilities.descriptionHtml(scope.mai[layersetName][layerName]);
    DomFacade.setLayerSpecDescription(layersetName, description);
    scopeUpdateLayers();
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
    // need to get the marker coordinates, 
    var latlng = marker.getLatLng();
    var markerLat = scope.mapFacade.getJurisdictionMarkerLat();
    var markerLng = scope.mapFacade.getJurisdictionMarkerLng();
    var isCartogram = DomFacade.isCartogramCheckboxChecked();
    // pass them to switchCoordinatesUrl
    var layerSpec = DomUtils.getSelectedLayerSpec(scope.mai, 'choroplethLayers');
    var polyYear = (isCartogram ?  layerSpec.cartogramPolyYear : layerSpec.mercatorPolyYear);
    url = scope.mai.switchCoordinatesUrl
          + "lat=" + markerLat
          + "&lng=" + markerLng
          + "&year=" + polyYear
          + "&toCartogram=" + (isCartogram ? 't' : 'f');
    // request the new coordinates
    Utilities.requestUrlWithScope(url, scope.switchCoordinatesCallback, scope);

    closureCityLabeller.refreshCityLabels(closureCityLabeller);
    scope.updateSharingUrl();
  }
};

/** Helper for changing coordinates from cartogram to mercator
 *  and vice versa.  Does not update the sharing URL, that happens
 *  in addIsCartogramCheckboxListener
 *  @callback switchCoordinates
 *  @param responseText
 *  @private
 *  SIDE EFFECTS: changes the DOM's sharing URL and the marker's location
 */
ListenerInitializer.prototype.switchCoordinatesCallback = function(jsonText) {
  var latlng = JSON.parse(jsonText);
  var lat = latlng[0];
  var lng = latlng[1];
  this.mapFacade.setJurisdictionMarkerLatLng(lat, lng);
};

/** Helper for responding to a click on graph.  Changes to map's date
 *  and also updates the sharing URL.  
 *  @callback setGraphUrlCallback
 *  @param responseText
 *  @private
 *  SIDE EFFECTS: changes the DOM's sharing URL and the map's infowindow
 */
ListenerInitializer.prototype.setGraphUrlCallback = function(urlString) {
  DomFacade.setGraphUrl(urlString);
  this.updateSharingUrl();
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
ListenerInitializer.prototype.handleClick = function(e) {
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

      var mapParams = 'lat=' + lat + '&lng=' + lng +
               '&zoom=' + scope.mapFacade.getZoom() ;
      var keepGoing = true;

      if (scope.mai.graphUrl){
        url = DomFacade.getNewGraphUrl(scope.mai, layerSpec);
        if (url) {
          url += mapParams;
          Utilities.requestUrlWithScope(url, scope.setGraphUrlCallback, scope);
          shouldStop = true;
        }
      }

      url = tileEngineClass.getPointInfoUrl(layerSpec);
      if(url) {
      
        url += mapParams;
  
        // close the popup until there is something for it to display
        scope.mapFacade.map.closePopup();
    
        // request is a verb here
        Utilities.requestUrlWithScope(url, scope.setPopupInfoCallback, scope);
        shouldStop = true;
      }
    }
    if (shouldStop) {
      return false;  // stop the =each= loop
    }
  });
  
};

/** Event handler for clicking on the map.  The action mostly happens
 *  in this.handleClick.
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
    scope.handleClick(myException);
  });
};

// TODO JSDOC
function millisecondsPerPixel(mai) {
    var xMinDateMilliseconds = Date.parse(mai.xSpanMinDate);
    var xMaxDateMilliseconds = Date.parse(mai.xSpanMaxDate);
    var pixelSpan = mai.xSpanMaxPixel-mai.xSpanMinPixel;
    var dateMillisecondsSpan = xMaxDateMilliseconds - xMinDateMilliseconds;
    var millisecondsPerPixelX = dateMillisecondsSpan / pixelSpan;
    return millisecondsPerPixelX;
}

/** Takes a span which gives date/pixel pairs for two points on
 *  an axis and an x-coordinate, and returns the date for that coordinate.
 *  @return int epoch time (in msec)
 *  TODO finish the JSDoc
 */
function pixelToDate(targetPixel, mai) {
    var xMinDateMilliseconds = Date.parse(mai.xSpanMinDate);

    var newDayMilliseconds =  ((targetPixel-mai.xSpanMinPixel) * millisecondsPerPixel(mai)) + xMinDateMilliseconds;
    var newDay = new Date(newDayMilliseconds);
    return newDay;
}

function dateToPixel(currentDayMilliseconds, mai) {
  var millisecondsSinceMinX = currentDayMilliseconds - Date.parse(mai.xSpanMinDate);
        var m = millisecondsPerPixel(mai);
        var xx = mai.xSpanMinPixel;
  var pixelX = Math.round(mai.xSpanMinPixel + (millisecondsSinceMinX / millisecondsPerPixel(mai)));
  return pixelX;
}

/** Event handler for clicking on the map.  The action mostly happens 
 *  in this.handleClick. 
 *  @param myException {event} The event triggering the request (named something 
      besides 'e' to make debugging a little easier) 
 *  SIDE EFFECT: adds listener 
 *  @private 
 */ 
ListenerInitializer.prototype.addGraphClickListener = function() { 
  var scope = this; 
  var graphDiv = DomFacade.getGraphDivElement(); 
 
  graphDiv.addEventListener('click', function(e) { 
 
    // FF doesn't have offsetX/Y; Chrome doesn't have layerX/Y 
    var x = e.hasOwnProperty('offsetX') ? e.offsetX : e.layerX; 
    var y = e.hasOwnProperty('offsetY') ? e.offsetY : e.layerY; 
   
    // xSpan is a somewhat arbitrary horizontal span on the graph, 
    // chosen purely to make it easy to measure the min/max 
    // x-pixels and the min and max dates.  This is then used 
    // to calculate how to convert from pixels to dates and back. 
 
    var newDay = pixelToDate(x, scope.mai); 
   
    var topBounds = scope.mai.yMinPixel; 
    var bottomBounds = scope.mai.yMaxPixel; 
    var leftBounds = dateToPixel(Date.parse(scope.mai.xMinDateBound), scope.mai);  
    var rightBounds = dateToPixel(Date.parse(scope.mai.xMaxDateBound), scope.mai); 
   
    // If the click is outside the active bounds, do nothing 
    if(x < leftBounds || x > rightBounds || 
       y < topBounds || y > bottomBounds) { 
      return; 
    } 
 
    var currentDayString = newDay.yyyymmdd(); 
 
    DomFacade.setCurrentDayElement(currentDayString); 
    updateDayControls(currentDayString, scope.mai.startDay, scope.mai.endDay, scope.mai); 
    scope.mapFacade.updateLayers() 
    scope.updateSharingUrl() 
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

