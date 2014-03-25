/** @author Kaitlin Duck Sherwood
 *  @class DomUtils
 *  @classdesc This class has methods which do not touch the map (those methods
 *    go into MapFacade) and which do not depend upon the naming of
 *    the DOM elements (those go into DomFacade).
 *    Note that this class has no state, so all the methods are class
 *    (AKA 'static') methods.
 */
function DomUtils() {};

// TODO generalize the projections, bug#12
/** Figures out what the projection type is.
 *  @return {string} String describing the projection type
 *  @private
 */
DomUtils.projectionType = function() {
  if (DomFacade.isCartogramCheckboxChecked()) {
    return 'cartogram';
  } else {
    return 'mercator';
  }
};

/** Gets a URL which can be used to recreate the map as it is shown
 *  right now.  Looks at the settings of all the controls in the DOM
 *  and the state of the map.
 *  @return {string} A URL suitable for sharing
 *  @private
 */
DomUtils.getSharingUrl = function(mapFacade) {
   var url = location.origin + location.pathname;
   var latlng = mapFacade.getCenter();

   url += '?lat=' + latlng.lat;
   url += '&lng=' + latlng.lng;
   url += '&zoom=' + mapFacade.getZoom();

   url += '&cartogram=' + DomFacade.getFlagForCartogramCheckbox();

   url += '&showCities=' + DomFacade.getFlagForCitiesCheckbox();

   if (mapFacade.jurisdictionMarker) {
     url += '&markerLat=' + mapFacade.getJurisdictionMarkerLat();
     url += '&markerLng=' + mapFacade.getJurisdictionMarkerLng();
   }

   var layersetNames = DomFacade.getLayersetNames();
   $.each(layersetNames, function(index, layersetName) {

     var checkbox = DomFacade.getCheckboxForLayerset(layersetName);
     if (checkbox) {
       var fieldName = 'show' +
              Utilities.capitalizeFirstLetter(layersetName);
       url += '&' + fieldName + '=' +
              DomFacade.getFlagForLayersetCheckbox(layersetName);
     }

     var selector = DomFacade.getSelectorForLayersetName(layersetName);
     if (selector) {
       url += '&' + layersetName + 'Index=' +
              (parseInt(selector.selectedIndex));
     }
  });

   // TODO someday add capability to show time series
   /*
   // Year and month are not always set
   if( typeof yearCombo != "undefined" ) {
     url += "&year=" + yearCombo.value;
   }
   if( typeof monthCombo != "undefined" ) {
     url += "&month=" + (parseInt(monthCombo.selectedIndex)+1);
   }
   */

   return url;
};

/** Utility to see if the mapApplicationInfo file specifies any layer
 *  of =layersetName= type.
 *  @param layersetName {string} layersetName The name of the type of the
 *   layer in question, e.g. 'dotLayers', 'choroplethLayers', or "borderLayers'
 *  @return {boolean} Are there any layers of layersetName type>
 *  @private
 */
DomUtils.layerSpecExists = function(mai, layersetName) {

  var key = this.findSelectedKeyForLayerType(layersetName);
  if (!key) {
    console.log('Warning: No ' + layersetName + ' layer specified');
    return false;
  }

  var layerSpec = mai[layersetName][key];
  if (!layerSpec) {
    console.log('No specification for ' + layersetName + "'s " + key +
                ' found in the JSON mapApplicationInfo spec');
    return false;
  }

  return true;
};

/** Utility to figure out which layer in a particular layerset the
 *  user has selectd to be the one displayed.
 *  @param layersetName {string} The name of the type of the layerset
 *   in question, e.g. 'dotLayers', 'choroplethLayers', or "borderLayers'
 *  @return {string} The key (name) of the layer, e.g.
 *   'unemployment' or 'povertyChildren' or 'gunDeaths' or 'stateBorder'
 *   NOTE: returns value even if checkbox is unchecked.
 *  @private
 */
DomUtils.findSelectedKeyForLayerType = function(layersetName) {
  var checkbox = DomFacade.getCheckboxForLayerset(layersetName);
  if (!checkbox) {
    return null;
  }

  var key = checkbox.value;

  if (key == SENTINEL_MULTIPLE) {
    // multiple options, select the one which is checked
    key = DomFacade.getSelectedLayerNameForLayerset(layersetName);
  }
  return key;
};

/** Gets the layerSpec for the currently-selected layer of the
 *  given layerset.
 *  @param {string} layersetName A string describing what type of
 *    layerset it is (valid strings: 'borderLayers' or 'choroplethLayers')
 *  @return {Object} LayerSpec object describing a layer.
 *  @private
 */
DomUtils.getSelectedLayerSpec = function(mai, layersetName) {
  if (!this.layerSpecExists(mai, layersetName)) {
    return null;
  }

  if (!DomFacade.isCheckboxForLayersetChecked(layersetName)) {
    return null;
  }

  var key = this.findSelectedKeyForLayerType(layersetName);
  var layerSpec = mai[layersetName][key];

  if (!layerSpec.tileEngine) {
    alert('There is no tileEngine specified in the layer ' + key);
    return null;
  }

  return mai[layersetName][key];
};

