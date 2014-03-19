/** @author Kaitlin Duck Sherwood
 *  @class MapBehaviorInitializer
 *  @classdesc This class is sort of like a Facade for the map, except
 *    I put the new behaviours right onto the map.
 *  behaviours relating to the map layers.
 *
 *  @constructor
 *  @this {MapBehaviorInitializer}
 *  @param {Object} aMap Leaflet map object, e.g. L.map
 *  @param {Object} aMapApplicationInfo JSON describing the application,
 *    especially the layers to go on the map
 *  @param {Object} aCityLabeller A class which shows city names
      on the map at the proper locations
 *  @param {Object} aJurisdictionMarker A Leaflet marker
 */
// @@@@ Should I make this MapFacade instead?
function MapBehaviorInitializer(aMap, aMapApplicationInfo, 
                                aCityLabeller, aJurisdictionMarker) {
  /** @private
   *  @member {Object}
   */
  this.map = aMap;

  /** @private */
  this.map.mai = aMapApplicationInfo;
  /** @private */
  this.cityLabeller = aCityLabeller;
  /** @private */
  this.map.visibleLayers = [];

  var closureCityLabeller = aCityLabeller;
  var closureMap = aMap;
  var closureJurisdictionMarker = aJurisdictionMarker;

  // Refreshes the city labels and sharing URL when the user moves the map.
  this.map.on('zoomend', function() {
    if (closureCityLabeller) {
      closureCityLabeller.refreshCityLabels(closureCityLabeller);
    }
    $('#sharingUrl')[0].href = closureMap.getSharingUrl();
  });

  // Refreshes the city labels and sharing URL when the user moves the map.
  this.map.on('dragend', function() {
    if (closureCityLabeller) {
      closureCityLabeller.refreshCityLabels(closureCityLabeller);
    }
    $('#sharingUrl')[0].href = closureMap.getSharingUrl();
  });

  /** Changes which layers are displayed on the map.
   * @public
   * (Used by ListenerInitializer)
   * SIDE EFFECT: the DOM updates
   */
  this.map.updateLayers = function() {

    // needed because "this" in the $.each is the layer
    var scope = this;

    $.each(this.visibleLayers,
           function(index, layer) {
             if (layer) {
               scope.removeLayer(layer);
             }
           });

    var layersetNames = DomFacade.getLayersetNames();
    $.each(layersetNames, function(index, layersetName) {
      var layerSpec = scope.getLayerSpec(layersetName);
      if (layerSpec) {
        var layer = scope.getLayer(layerSpec);
        if (layer) {
          scope.addLayer(layer);
          scope.visibleLayers.push(layer);
        }
      }
    });
  };

  /** Figures out what the projection type is.
   *  @return {string} String describing the projection type
   *  @private
   */
  this.map.projectionType = function() {
    if ($('#isCartogramCheckbox').is(':checked')) {
      return 'cartogram';
    } else {
      return 'mercator';
    }
  };


  /** Gets the layerSpec for the currently-selected layer of the
   *  given layerset.
   *  @param {string} layersetName A string describing what type of
   *    layerset it is (valid strings: 'borderLayers' or 'choroplethLayers')
   *  @return {Object} LayerSpec object describing a layer.
   *  @private
   */
  this.map.getLayerSpec = function(layersetName) {
    if (!this.layerSpecExists(layersetName)) {
      return null;
    }

    if (!$('#' + layersetName + 'Checkbox').is(':checked')) {
      return null;
    }

    var key = this.findSelectedKeyForLayerType(layersetName);
    var layerSpec = this.mai[layersetName][key];

    if (!layerSpec.tileEngine) {
      alert('There is no tileEngine specified in the layer ' + key);
      return null;
    }

    return this.mai[layersetName][key];
  };


  /** Figures out what the projection type is.
   *  @param {object} Layerspec used to generate the layer on the map
   *  @return {object} Leaflet layer for use on map
   *  @private
   */
  this.map.getLayer = function(layerSpec) {

    var supportClass;
    if (layerSpec.tileEngine) {
      supportClass = Validator.classForTileType(layerSpec.tileEngine);
    } else {
      supportClass = MapeteriaChoroplethLayerSpecFormatSupport;
    }

    url = supportClass.getLayerUrl(layerSpec, this.projectionType());

    if (layerSpec.legendUrl) {
      $('#legendImage')[0].update(layerSpec);
    }

    return L.tileLayer(url, {
      maxZoom: 18,
      attribution: layerSpec.source
    });

  };


  /** Utility to see if the mapApplicationInfo file specifies any layer
   *  of =layersetName= type.
   *  @param layersetName {string} layersetName The name of the type of the
   *   layer in question, e.g. 'dotLayers', 'choroplethLayers', or "borderLayers'
   *  @return {boolean} Are there any layers of layersetName type>
   *  @private
   */
  this.map.layerSpecExists = function(layersetName) {

    var key = this.findSelectedKeyForLayerType(layersetName);
    if (!key) {
      console.log('Warning: No ' + layersetName + ' layer specified');
      return false;
    }

    var layerSpec = this.mai[layersetName][key];
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
  this.map.findSelectedKeyForLayerType = function(layersetName) {
    var checkboxId = '#' + layersetName + 'Checkbox';
    if (!$(checkboxId)) {
      return null;
    }

    var key = $(checkboxId).val();

    if (key == SENTINEL_MULTIPLE) {
      // multiple options, select the one which is checked
      var layerSelectorId = '#' + layersetName + 'Selector';
      key = $(layerSelectorId).find(':selected').val();
    }
    return key;
  };

  /** Initializes the map.
   *  @public
   *  SIDE EFFECTS: Initializes everything
   */
  this.initialize = function() {
    this.map.updateLayers();
  };

  /** Gets a URL which can be used to recreate the map as it is shown
   *  right now.  Looks at the settings of all the controls in the DOM
   *  and the state of the map.
   *  @return {string} A URL suitable for sharing
   *  @private
   */
  this.map.getSharingUrl = function() {
     var url = location.origin + location.pathname;
     var latlng = closureMap.getCenter();

     url += '?lat=' + latlng.lat;
     url += '&lng=' + latlng.lng;
     url += '&zoom=' + closureMap.getZoom();

     url += '&cartogram=' + closureMap.
                              getFlagForCheckbox('#isCartogramCheckbox');

     url += '&showCities=' + 
            closureMap.getFlagForCheckbox('#showCitiesCheckbox');

     if (closureJurisdictionMarker) {
       url += '&markerLat=' + closureJurisdictionMarker.getLatLng().lat;
       url += '&markerLng=' + closureJurisdictionMarker.getLatLng().lng;
     }

     var layersetNames = DomFacade.getLayersetNames();
     $.each(layersetNames, function(index, layersetName) {
      
       var checkboxId = '#' + layersetName + 'Checkbox';
       var checkbox = $(checkboxId).first()[0];
       if (checkbox) {
         var fieldName = 'show' +
                Utilities.capitalizeFirstLetter(layersetName);
         url += '&' + fieldName + '=' +
                closureMap.getFlagForCheckbox(checkboxId);
       }

       var selectorId = '#' + layersetName + 'Selector';
       var selector = $(selectorId).first()[0];
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

  /** Figures out if the map should be in cartogram projection or not.
   *  @return {string} Returns a single character 't' or 'f' to
   *    represent whether the map should show the cartogram projection or not.
   *    It is a string and not a boolean because it will be used in
   *    a URL query string.
   *  @private
   */
  this.map.getFlagForCheckbox = function(checkboxElementName) {
     var element = $(checkboxElementName);
     if (!element) {
       return 'f';
     }
     return $(checkboxElementName).is(':checked') ? 't' : 'f';
  };


}






