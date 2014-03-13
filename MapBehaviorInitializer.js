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
  this.dotLayer = null;
  /** @private */
  this.borderLayer = null;
  /** @private */
  this.choroplethLayer = null;

  var closureCityLabeller = aCityLabeller;
  var closureMap = aMap;
  var closureJurisdictionMarker = aJurisdictionMarker;

  // Refreshes the city labels and sharing URL when the user moves the map.
  this.map.on("zoomend", function () {
    closureCityLabeller.refreshCityLabels(closureCityLabeller);
    $( '#sharingUrl' )[0].href = closureMap.getSharingUrl();
  });

  // Refreshes the city labels and sharing URL when the user moves the map.
  this.map.on("dragend", function () {
    closureCityLabeller.refreshCityLabels(closureCityLabeller);
    $( '#sharingUrl' )[0].href = closureMap.getSharingUrl();
  });

  /** Changes which layers are displayed on the map.
   * @public
   * (Used by ListenerInitializer)
   * SIDE EFFECT: the DOM updates
   */
  this.map.updateLayers = function () { 
    
    // needed because "this" in the $.each is the layer
    var thisMap = this  ;

    $.each([this.dotLayer, this.borderLayer, this.choroplethLayer],
           function (index, layer) {
             if(layer) {
               thisMap.removeLayer(layer);
             }
           });

    this.dotLayer = this.getDotLayer();
    this.borderLayer = this.getBorderLayer();
    this.choroplethLayer = this.getChoroplethLayer();

    $.each([this.choroplethLayer, this.borderLayer, this.dotLayer],
           function (index, layer) {
             if(layer) {
               thisMap.addLayer(layer);
             }
           });
  };


  /** Figures out what the projection type is.
   *  @returns {string} String describing the projection type
   *  @private
   */
  this.map.projectionType = function () {
    if( $( '#isCartogramCheckbox' ).is(':checked')) {
      return 'cartogram' ;
    } else {
      return 'mercator';
    }
  };

  /** Creates a choropleth layer for the map to use
   *  @returns {Object} Layer object describing a choropleth layer
   *  @private
   */
  this.map.getChoroplethLayer = function () {
    // TODO need to refactor when move this into a LayerFactory
    var layersetName = 'choroplethLayers';

    if(!$( '#' + layersetName + 'Checkbox').is(':checked')) {
      return null;
    }

    var key = this.findSelectedKeyForLayerType(layersetName);
    var layerSpec = this.mai[layersetName][key] ;

    if(!this.validateChoroplethLayerspec(layerSpec)) {
      var descriptor = layerSpec.shortDescription;
      if(!descriptor) {
        descriptor = 'unnamed';
      }
      alert("The specification for the " + key + " choropleth layer is not valid, alas.");
      console.log('Invalid layer specification for ' + key);
      return null;
    }

    return this.getPolygonLayer('choroplethLayers', false);
  };

  /** Creates a border layer for the map to use
   * @returns {Object} Layer object describing a border layer
   * @private
   */
  this.map.getBorderLayer = function () {
    return this.getPolygonLayer('borderLayers', true);
  };

  /** Creates a polygon layer -- either choropleth or border --
   *  for the map to use.
   *  @param {string} layersetName A string describing what type of
   *    layerset it is (valid strings: 'borderLayers' or 'choroplethLayers')
   *  @param {string} showBorder Flag which tells if there should be a border on
   *    the polygons or not.  This is needed because what the user sees as
   *    a border might be implemented either as a separate layer or as
   *    a choropleth layer which happens to have a border.  
   *  TODO implement borders as choropleth borders
   *  @returns {Object} Layer object describing a border or choropleth layer.
   *  @private
   */
  this.map.getPolygonLayer = function (layersetName, showBorder) {
    if(!this.layerSpecExists(layersetName)) {
      return null;
    }

    if(!$( '#' + layersetName + 'Checkbox').is(':checked')) {
      return null;
    }

    var key = this.findSelectedKeyForLayerType(layersetName);
    var layerSpec = this.mai[layersetName][key] ;

    var shapeType = layerSpec[this.projectionType() + 'ShapeType'];
    var polyYear = layerSpec[this.projectionType() + 'PolyYear'];
    if (!shapeType || !polyYear) {
      alert("There is no information for the " + layerSpec.shortDescription +
            " layer for the " + this.projectionType() + " projection.");
      return null;
    }

    var url = BINDIR + "/choropleth.phpx?x={x}&y={y}&zoom={z}&";

    url += 'polyType=' + layerSpec[this.projectionType() + 'ShapeType'];
    url += '&polyYear=' + layerSpec[this.projectionType() + 'PolyYear'];
    url += '&table=' + layerSpec.table;
    url += '&field=' + layerSpec.fieldName;
    url += '&year=' + layerSpec.year;


    // @@@ I suppose I could also check for null or undefined...
    if(layerSpec.hasOwnProperty('normalizerType') &&
       layerSpec.hasOwnProperty('normalizerField') &&
       layerSpec.hasOwnProperty('normalizerYear') ) {
      url += '&normalizer=' + layerSpec.normalizerField;
      url += '&normalizerType=' + layerSpec.normalizerType;
      url += '&normalizerYear=' + layerSpec.normalizerYear;
    } else {
      url += '&normalizer=null' ;
      url += '&normalizerYear=1';
      url += '&normalizerType=n';
    }

    // border layers don't have these
    // TODO look for each one before printing it out, which probably means 
    // TODO writing a helper method
    if(layerSpec.hasOwnProperty('minValue')) {
      url += '&minValue=' + layerSpec.minValue;
      url += '&maxValue=' + layerSpec.maxValue;
      url += '&minColor=' + layerSpec.minColor;
      url += '&maxColor=' + layerSpec.maxColor;
    }
    url += '&mapping=' + layerSpec.mapping;

    if(showBorder) {
      var borderWidth = 1;
      if(layerSpec.hasOwnProperty('borderWidth')) {
        borderWidth = layerSpec.borderWidth;
      }
      url += "&borderColor="+layerSpec.borderColor +
             "&border=solid&width="+layerSpec.borderWidth;
    }

    if(layersetName == "choroplethLayers") {
      $( '#legendImage' )[0].update(layerSpec);
    }
       
    return L.tileLayer(url, {
      maxZoom: 18,
      attribution: layerSpec.source
    });

  };

  // TODO move into a MapeteriaChoroplethLayerFactory
  this.map.validateChoroplethLayerspec = function(layerSpec) {
    var requiredFieldsTable = {'fieldName' : 'word',
                               'table' : 'word',
                               'year' : 'int',
                               'minColor' : 'color',
                               'maxColor' : 'color',
                               'minValue' : 'float',
                               'maxValue' : 'float'
                              };
    var optionalFieldsTable = {'tileGenerator' : 'word',
                               'tileGeneratorVersion' : 'float',
                               'mercatorPolyYear' : 'int',
                               'mercatorTable' : 'word',
                               'cartogramPolyYear' : 'int',
                               'cartogramTable' : 'word',
                               'isPercentage' : 'bool',
                               'shortDescription' : 'text',
                               'description' : 'text',
                               'mapping' : 'text',
                               'sourceUrl' : 'url',
                               'source' : 'text'};

    // It's okay to only have one of mercator and cartogram specs,
    // but you must have at least one (and the field name, table name,
    // and polyYear all be the same projection type and all be there).
    var hasMercators = layerSpec.mercatorShapeType &&
                       layerSpec.mercatorPolyYear;
    var hasCartograms = layerSpec.mercatorShapeType &&
                        layerSpec.mercatorPolyYear;
    if(!(hasMercators || hasCartograms)) {
      console.log("hasMercators: " + hasMercators);
      console.log("hasCartograms: " + hasCartograms);
      return false;
    }

    // TODO move this into the superclass of the LayerFactory
    var success = true;
    $.each(requiredFieldsTable, function(fieldName, fieldType) {
      if(!layerSpec.hasOwnProperty(fieldName)) {
        console.log("Choropleth layer is missing field " + fieldName);
        success = false;
        return false;
      }
      if(!Validator.isLegal(fieldType, layerSpec[fieldName])) {
        console.log(fieldName + " of " + layerSpec[fieldName] + " is invalid");
        success = false;
        return false;
      }
    });


    $.each(optionalFieldsTable, function(fieldName, fieldType) {
      if(layerSpec[fieldName]) {
        if(!Validator.isLegal(fieldType, layerSpec[fieldName])) {
          console.log(fieldName + " of " + layerSpec[fieldName] + " is invalid");
          success = false;
          return false;
        }
      }
    });
    
    return success;
  };

  // TODO move into a DotLayerFactory (MapeteriaDotLayerFactory?)
  /** Checks that the specification for a dot layer is
   *  sensical and complete.
   *  @returns {Object} Layer object describing a dots layer.
   *  @private
   */
  this.map.validateDotLayerspec = function(layerSpec) {
    var requiredFieldsTable = {'year' : 'int',
                               'size' : 'int',
                               'color' : 'color'};
    var optionalFieldsTable = {'tileGenerator' : 'word',
                               'tileGeneratorVersion' : 'float',
                               'mercatorFieldName' : 'word',
                               'mercatorTable' : 'word',
                               'cartogramTable' : 'word',
                               'cartogramFieldName' : 'word',
                               'shortDescription' : 'text',
                               'description' : 'text',
                               'sourceUrl' : 'url',
                               'source' : 'text'};

    // It's okay to only have one of mercator and cartogram specs,
    // but you must have at least one (and the field name and table 
    // need to match)
    var hasMercators = layerSpec.mercatorFieldName &&
                       layerSpec.mercatorTable;
    var hasCartograms = layerSpec.cartogramFieldName &&
                        layerSpec.cartogramTable;
    if(!(hasMercators || hasCartograms)) {
      return false;
    }

    // TODO move this into the superclass of the LayerFactory
    var success = true;
    $.each(requiredFieldsTable, function(fieldName, fieldType) {
      if(!layerSpec.hasOwnProperty(fieldName)) {
        console.log("Choropleth layer is missing field " + fieldName);
        success = false;
        return false;
      }
      if(!Validator.isLegal(fieldType, layerSpec[fieldName])) {
        console.log(fieldName + " of " + layerSpec[fieldName] + " is invalid");
        success = false;
        return false;
      }
    });

    $.each(optionalFieldsTable, function(fieldName, fieldType) {
      if(layerSpec[fieldName]) {
        if(!Validator.isLegal(fieldType, layerSpec[fieldName])) {
          console.log(fieldName + " of " + layerSpec[fieldName] + " is invalid");
          success = false;
          return false;
        }
      }
    });
    

    return success;

  };

  /** Creates a dots layer for the map to use.
   *  @returns {Object} Layer object describing a dots layer.
   *  @private
   */
  // TODO change this to a use a DotLayerFactory, and choose
  // which LayerFactory type to use based on layersetType in the 
  // layerspec.
  this.map.getDotLayer = function () {
    var layersetName = 'dotLayers';
    if(!this.layerSpecExists('dotLayers')) {
      return null;
    }

    if(!$( '#dotLayersCheckbox').is(':checked')) {
      return null;
    }



    var key = this.findSelectedKeyForLayerType(layersetName);
    var layerSpec = this.mai[layersetName][key] ;

    if(!this.validateDotLayerspec(layerSpec)) {
      var descriptor = layerSpec.shortDescription;
      if(!descriptor) {
        descriptor = 'unnamed';
      }
      alert("The specification for the " + key + " dot layer is not valid, alas.");
      console.log('Invalid layer specification for ' + key);
      return null;
    }
  
    var url = BINDIR + "/dots.php?x={x}&y={y}&zoom={z}&";
    url += 'points=' + layerSpec[this.projectionType() + 'Table'];
    url += '&name=' + layerSpec[this.projectionType() + 'FieldName'];
    url += '&year=' + layerSpec.year;
    url += '&colour=' + layerSpec.color;
    url += '&size=' + layerSpec.size;
    url += '&jId=0';	// I think this is just for symmetry with MapRequest
  
    return L.tileLayer(url, {
      maxZoom: 18,
      attribution: layerSpec.source
    });
  };

  /** Utility to see if the mapApplicationInfo file specifies any layer
   *  of =layersetName= type.
   *  @param layersetName {string} layersetName The name of the type of the 
   *   layer in question, e.g. 'dotLayers', 'choroplethLayers', or "borderLayers'
   *  @returns {boolean} Are there any layers of layersetName type>
   *  @private
   */
  this.map.layerSpecExists = function (layersetName) {

    var key = this.findSelectedKeyForLayerType(layersetName);
    if(!key) {
      console.log('Warning: No ' + layersetName + ' layer specified');
      return false;
    }
  
    var layerSpec = this.mai[layersetName][key] ;
    if(!layerSpec) {
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
   *  @returns {string} The key (name) of the layer, e.g. 
   *   'unemployment' or 'povertyChildren' or 'gunDeaths' or 'stateBorder'
   *  @private
   */
  this.map.findSelectedKeyForLayerType  = function (layersetName) {
    var checkboxId = '#' + layersetName + 'Checkbox';
    if(!$( checkboxId )) {
      return false;
    }

    if($( checkboxId ).is(':checked')) {
      var key = $( checkboxId ).val();
  
      if(key == SENTINEL_MULTIPLE) {
        // multiple options, select the one which is checked
        var layerSelectorId = '#' + layersetName + 'Selector';
        key = $( layerSelectorId ).find(':selected').val();
      } 
      return key;
    }
  };

  /** Initializes the map.
   *  @public
   *  SIDE EFFECTS: Initializes everything
   */
  this.initialize = function () {
    this.map.updateLayers();
  };

  /** Gets a URL which can be used to recreate the map as it is shown
   *  right now.  Looks at the settings of all the controls in the DOM
   *  and the state of the map.
   *  @returns {string} A URL suitable for sharing
   *  @private
   */
  this.map.getSharingUrl = function() {
     var url = location.origin + location.pathname;
     var latlng = closureMap.getCenter();
  
     url += "?lat=" + latlng.lat;
     url += "&lng=" + latlng.lng;
     url += "&zoom=" + closureMap.getZoom();

     url += "&cartogram=" + closureMap.
                              getFlagForCheckbox('#isCartogramCheckbox');

     url += "&showCities=" + closureMap.getFlagForCheckbox('#showCitiesCheckbox');
  
     if(closureJurisdictionMarker) {
       url += "&markerLat=" + closureJurisdictionMarker.getLatLng().lat;
       url += "&markerLng=" + closureJurisdictionMarker.getLatLng().lng;
     }
  
     var layerTypes = ['choropleth', 'dot', 'border'];
     // TODO use $.each() instead
     for (var i=0; i<3; i++) {
       var layerType = layerTypes[i];
       var layer = layerType + 'Layers';
       var checkboxId =  '#' + layer + 'Checkbox';
       var checkbox = $( checkboxId ).first()[0];
       if(checkbox) {
         var fieldName = 'show' + capitalizeFirstLetter(layerType) + 's';
         url += '&' + fieldName + '=' +
                closureMap.getFlagForCheckbox(checkboxId);
       }
  
       var selectorId = '#' + layer + 'Selector';
       var selector = $( selectorId).first()[0];
       if(selector) {
         url += '&' + layerType + 'Index=' +
                (parseInt(selector.selectedIndex));
       }
    }
  
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
   *  @returns {string} Returns a single character 't' or 'f' to 
   *    represent whether the map should show the cartogram projection or not.
   *    It is a string and not a boolean because it will be used in 
   *    a URL query string.
   *  @private
   */
  this.map.getFlagForCheckbox = function (checkboxElementName) {
     var element = $( checkboxElementName );
     if(!element) {
       return 'f';
     }
     return $( checkboxElementName ).is(':checked') ? 't' : 'f';
  };


}






