// TODO this is like an abstract superclass; is there any way to throw
// an error if MapFacade itself is constructed?
/** @author Kaitlin Duck Sherwood
 *  @class MapFacade
 *  @classdesc This class is sort of like a Facade for the map, except
 *    I put the new behaviours right onto the map.
 *  behaviours relating to the map layers.
 *
 *  @constructor
 *  @this {MapBehaviorInitializer}
 *  @param {Object} aMapApplicationInfo JSON describing the application,
 *    especially the layers to go on the map
 *  @param {Object} aJurisdictionMarker A Leaflet marker
 */
function MapFacade(aMapApplicationInfo) {
  /** @private
   *  @member {Object}
   */
  /** @private */
  this.mai = aMapApplicationInfo;
  /** @private */
  this.visibleLayers = [];
  /** @private */
  this.jurisdictionMarker = null;

}

/** Makes an instance of a subclass of MapFacade, defaulting to a
 *  LeafletMapFacade.
 *  and the state of the map.
 *  @return {object} A instance of a subclass of MapFacade
 *  @public
 */
MapFacade.makeMapFacade = function(mai) {
  if(!mai.slippyMapFramework) {
    console.log("Defaulting to use Leaflet.");
    mai.slippyMapFramework = "leaflet";
  }
  
  switch (mai.slippyMapFramework) {
    case 'leaflet':
      return new LeafletMapFacade(mai);
      break;
    default:
      alert('Sorry, we have not implemented code for ' + 
            mai.slippyMapFrameworkName + ' yet.  Fork mapzarf on github!');
      return null;
    }
}


/** Changes which layers are displayed on the map.
 * @public
 * (Used by ListenerInitializer)
 * SIDE EFFECT: the DOM updates
 */
MapFacade.prototype.updateLayers = function() {

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
    var layerSpec = DomUtils.getSelectedLayerSpec(scope.mai, layersetName);
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
 *  @param {object} Layerspec used to generate the layer on the map
 *  @return {object} Leaflet layer for use on map
 *  @private
 */
MapFacade.prototype.getLayer = function(layerSpec) {

  var supportClass;
  if (layerSpec.tileEngine) {
    supportClass = Validator.classForTileType(layerSpec.tileEngine);
  } else {
    supportClass = MapeteriaChoroplethLayerSpecFormatSupport;
  }

  url = supportClass.getLayerUrl(layerSpec, DomUtils.projectionType());

  if (layerSpec.legendUrl) {
    DomFacade.updateLegend(layerSpec.legendUrl);
  }

  return L.tileLayer(url, {
    maxZoom: 18,
    attribution: layerSpec.source
  });

};

