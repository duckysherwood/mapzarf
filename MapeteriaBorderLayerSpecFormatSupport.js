/** @author Kaitlin Duck Sherwood
 *  @class MapeteriaDotLayerSpecFormatSupport
 *  @classdesc This class is as simple as it gets for tile layers.
 *    It has a URL in it and some metadata, but really there's just the URL.
 *    This class needs no storage, so all the methods are class methods.
 *
 *  @constructor
 *  @this {BareLayerSpecFormatSupport}
 */
function MapeteriaBorderLayerSpecFormatSupport() {
}

/** This translates a border layerSpec into a choroplethLayerSpec.
 *  (Really, the Mapeteria borders code is implemented by the choropleth code.)
 *  The tile coordinates will get modified by the mapping framework.
 *  @public
 *  @param {object} layerSpec Information about the layer
 *  @return {string} Something which is in the same format as the
 *    incoming layer spec, but has slightly different content.
 *  (Used by MapBehaviorInitializer)
 */
MapeteriaBorderLayerSpecFormatSupport.asChoroplethLayerSpec =
  function(layerSpec) {

  if (!layerSpec) {
    return null;
  }

  var fieldsToCopy = ['tileEngineVersion',
                      'table', 'year', 'borderColor',
                      'borderWidth', 'borderColor',
                      'shortDescription', 'description', 'sourceUrl',
                      'providerUrl', 'provider',
                      'licenseUrl', 'license',
                      'mercatorShapeType', 'mercatorPolyYear',
                      'cartogramShapeType', 'cartogramPolyYear'];

  var fakeSpec = {};
  $.each(fieldsToCopy, function(index, value) {
    if (layerSpec[value]) {
      fakeSpec[value] = layerSpec[value];
    }
  });

  fakeSpec.tileEngine = 'mapeteriaChoropleth';
  fakeSpec.fieldName = 'jurisdictionId';
  fakeSpec.mapping = 'none';
  fakeSpec.showBorder = true;

  // There needs to be *some* min/max color to keep the validator happy.
  if (!layerSpec.minColor) {
    fakeSpec.minColor = 'ffffff';
  }
  if (!layerSpec.maxColor) {
    fakeSpec.maxColor = '000000';
  }
  if (!layerSpec.minValue) {
    fakeSpec.minValue = 1;
  }
  if (!layerSpec.maxValue) {
    fakeSpec.maxValue = 1;
  }
  return fakeSpec;

};

/** Gives a URL which tells how to fetch a tile.
 *  The tile coordinates will get modified by the mapping framework.
 *  @public
 *  @param {object} layerSpec Information about the layer
 *  @param {string} projection Identifier for the projection type
 *  @return {string} A URL which tells how to fetch a tile
 *  (Used by MapBehaviorInitializer)
 */
MapeteriaBorderLayerSpecFormatSupport.getLayerUrl = function(layerSpec, projection) {

  var fakeSpec = MapeteriaBorderLayerSpecFormatSupport
                               .asChoroplethLayerSpec(layerSpec);
  return MapeteriaChoroplethLayerSpecFormatSupport.getLayerUrl(fakeSpec, projection);

};


/** Renders a verdict on whether or not the layerSpec is valid.  Attempts
 *  to do some semantic checking as well as syntactic checking.
 *  @public
 *  @param {object} layerSpec Information about the layer
 *  @return {boolean} If the layerSpec is valid or not.
 *  (Used by MapBehaviorInitializer)
 */
// @@@ TODO is this needed?  can't I use the choropleth one?
MapeteriaBorderLayerSpecFormatSupport.validate = function(layerSpec) {
  var requiredFieldsTable = {'shortName' : 'word',
                             'tileEngine' : 'word',
                             'tileEngineVersion' : 'float',
                             'table' : 'word',
                             'year' : 'int'
                            };
  var optionalFieldsTable = {'mercatorPolyYear' : 'int',
                             'mercatorTable' : 'word',
                             'cartogramPolyYear' : 'int',
                             'cartogramTable' : 'word',
                             'shortDescription' : 'text',
                             'description' : 'text',
                             'minColor' : 'color',
                             'maxColor' : 'color',
                             'minValue' : 'float',
                             'maxValue' : 'float',
                             'legendUrl' : 'url',
                             'sourceUrl' : 'url',
                             'source' : 'text'};

  if (!layerSpec.tileEngine) {
    console.log('Tile type not specified for border layer');
    return false;
  }

  if (layerSpec.tileEngine != 'mapeteriaBorder') {
    console.log('Called border class but requested ' +
                layerSpec.tileType + ' tile type');
    return false;
  }

  // It's okay to only have one of mercator and cartogram specs,
  // but you must have at least one (and the field name, table name,
  // and polyYear all be the same projection type and all be there).
  var hasMercators = layerSpec.mercatorShapeType && layerSpec.mercatorPolyYear;
  var hasCartograms = layerSpec.mercatorShapeType && layerSpec.mercatorPolyYear;
  var hasValidFields = Validator.validateFields(layerSpec,
                               requiredFieldsTable, optionalFieldsTable);
  if (!(hasMercators || hasCartograms) || !hasValidFields) {
    alert('The ' + layerSpec.shortName + ' layer is not valid, alas.');
    return false;
  }

  return true;

};


