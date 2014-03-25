/** @author Kaitlin Duck Sherwood
 *  @class MapeteriaDotLayerSpecFormatSupport
 *  @classdesc This class is as simple as it gets for tile layers.
 *    It has a URL in it and some metadata, but really there's just the URL.
 *    This class needs no storage, so all the methods are class methods.
 *
 *  @constructor
 *  @this {BareLayerSpecFormatSupport}
 */
function MapeteriaDotLayerSpecFormatSupport() {
}


/** Gives a URL which tells how to fetch a tile.
 *  The tile coordinates will get modified by the mapping framework.
 *  @public
 *  @param {object} layerSpec Information about the layer
 *  @param {string} projection Identifier for the projection type
 *  @return {string} A URL which tells how to fetch a tile
 *  (Used by MapBehaviorInitializer)
 */
MapeteriaDotLayerSpecFormatSupport.getLayerUrl = function(layerSpec, projection) {
    var url = 'http://maps.webfoot.com/mapeteria2/dots.php?x={x}&y={y}&zoom={z}&';
    url += 'points=' + layerSpec[projection + 'Table'];
    url += '&name=' + layerSpec[projection + 'FieldName'];
    url += '&year=' + layerSpec.year;
    url += '&colour=' + layerSpec.color;
    url += '&size=' + layerSpec.size;
    url += '&jId=0';    // I think this is just for symmetry with MapRequest

    return url;
};


/** Renders a verdict on whether or not the layerSpec is valid.  Attempts
 *  to do some semantic checking as well as syntactic checking.
 *  @public
 *  @param {object} layerSpec Information about the layer
 *  @return {boolean} If the layerSpec is valid or not.
 *  (Used by MapBehaviorInitializer)
 */
MapeteriaDotLayerSpecFormatSupport.validate = function(layerSpec) {
  var requiredFieldsTable = {'shortName' : 'word',
                             'tileEngine' : 'word',
                             'tileEngineVersion' : 'float',
                             'year' : 'int'
                            };
  var optionalFieldsTable = {'color' : 'color',
                             'size' : 'int',
                             'mercatorPoints' : 'word',
                             'cartogramPoints' : 'word',
                             'shortDescription' : 'text',
                             'description' : 'text',
                             'sourceUrl' : 'url',
                             'legendUrl' : 'url',
                             'providerUrl' : 'url',
                             'provider' : 'text',
                             'licenseUrl' : 'url',
                             'license' : 'text'
                            };

  if (!layerSpec.tileEngine) {
    console.log(layerSpec);
    console.log('Tile type not specified for dot layer');
    return false;
  }

  if (layerSpec.tileEngine != 'mapeteriaDot') {
    console.log('Called dot class but requested ' +
                layerSpec.tileType + ' tile type');
    return false;
  }

  // It's okay to only have one of mercator and cartogram table,
  // but you must have at least one.
  var hasMercators = layerSpec.mercatorTable && layerSpec.mercatorFieldName;
  var hasCartograms = layerSpec.cartogramTable && layerSpec.cartogramFieldName;
  var hasValidFields = Validator.validateFields(layerSpec,
                               requiredFieldsTable, optionalFieldsTable);
  if (!(hasMercators || hasCartograms) || !hasValidFields) {
    alert('The ' + layerSpec.shortName + ' layer is not valid, alas.');
    return false;
  }

  return true;

};



