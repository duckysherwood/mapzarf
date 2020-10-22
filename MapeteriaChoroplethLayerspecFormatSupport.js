/** @author Kaitlin Duck Sherwood
 *  @class MapeteriaDotLayerSpecFormatSupport
 *  @classdesc This class is as simple as it gets for tile layers.
 *    It has a URL in it and some metadata, but really there's just the URL.
 *    This class needs no storage, so all the methods are class methods.
 *
 *  @constructor
 *  @this {BareLayerSpecFormatSupport}
 */
function MapeteriaChoroplethLayerSpecFormatSupport() {
  console.log('init');
}

/** Gives a URL which tells how to fetch a tile.
 *  The tile coordinates will get modified by the mapping framework.
 *  @public
 *  @param {object} layerSpec Information about the layer
 *  @param {string} projection Identifier for the projection type
 *  @return {string} A URL which tells how to fetch a tile
 *  (Used by MapBehaviorInitializer)
 */
MapeteriaChoroplethLayerSpecFormatSupport.getLayerUrl = function(layerSpec, projection) {

  var shapeType = layerSpec[projection + 'ShapeType'];
  var polyYear = layerSpec[projection + 'PolyYear'];
  if (!shapeType || !polyYear) {
    alert('There is no information for the ' + layerSpec.shortDescription +
          ' layer for the ' + projection + ' projection.');
    return null;
  }

  var url = 'http://maps.webfoot.com/mapeteria2/choropleth.php?x={x}&y={y}&zoom={z}&';

  url += 'polyType=' + layerSpec[projection + 'ShapeType'];
  url += '&polyYear=' + layerSpec[projection + 'PolyYear'];
  url += '&table=' + layerSpec.table;
  url += '&field=' + layerSpec.fieldName;
  url += '&year=' + layerSpec.year;


  if (layerSpec.hasOwnProperty('normalizerType') &&
     layerSpec.hasOwnProperty('normalizerField') &&
     layerSpec.hasOwnProperty('normalizerYear')) {
    url += '&normalizer=' + layerSpec.normalizerField;
    url += '&normalizerType=' + layerSpec.normalizerType;
    url += '&normalizerYear=' + layerSpec.normalizerYear;
  } else {
    url += '&normalizer=null';
    url += '&normalizerYear=1';
    url += '&normalizerType=n';
  }

  // border layers don't have these
  if (layerSpec.hasOwnProperty('minValue')) {
    url += '&minValue=' + layerSpec.minValue;
    url += '&maxValue=' + layerSpec.maxValue;
    url += '&minColor=' + layerSpec.minColor;
    url += '&maxColor=' + layerSpec.maxColor;
  }
  url += '&mapping=' + layerSpec.mapping;

  if (layerSpec.showBorder) {
    var borderWidth = 1;
    if (layerSpec.hasOwnProperty('borderWidth')) {
      borderWidth = layerSpec.borderWidth;
    }
    url += '&borderColor='+ layerSpec.borderColor +
           '&border=solid&width='+ layerSpec.borderWidth;
  }

  if (layerSpec.isDaily) {
    url += '&day=' + DomFacade.getCurrentDayString();
  }

  return url;

};

/** Renders a verdict on whether or not the layerSpec is valid.  Attempts
 *  to do some semantic checking as well as syntactic checking.
 *  @public
 *  @param {object} layerSpec Information about the layer
 *  @return {boolean} If the layerSpec is valid or not.
 *  (Used by MapBehaviorInitializer)
 */
MapeteriaChoroplethLayerSpecFormatSupport.validate = function(layerSpec) {
  var requiredFieldsTable = {'shortName' : 'word',
                             'tileEngine' : 'word',
                             'tileEngineVersion' : 'float',
                             'fieldName' : 'word',
                             'table' : 'word',
                             'year' : 'int',
                             'minColor' : 'color',
                             'maxColor' : 'color',
                             'minValue' : 'float',
                             'maxValue' : 'float'
                            };
  var optionalFieldsTable = {'tileEngine' : 'word',
                             'tileEngineVersion' : 'float',
                             'mercatorPolyYear' : 'int',
                             'mercatorTable' : 'word',
                             'cartogramPolyYear' : 'int',
                             'cartogramTable' : 'word',
                             'isPercentage' : 'bool',
                             'shortDescription' : 'text',
                             'description' : 'text',
                             'sourceUrl' : 'url',
                             'mapping' : 'text',
                             'showBorder' : 'bool',
                             'legendUrl' : 'url',
                             'timeSeries' : 'text',
                             'providerUrl' : 'url',
                             'provider' : 'text',
                             'licenseUrl' : 'url',
                             'license' : 'text'
                            };

  if (!layerSpec.tileEngine) {
    console.log('Tile type not specified for choropleth layer');
    return false;
  }

  if (layerSpec.tileEngine != 'mapeteriaChoropleth') {
    console.log('Called choropleth class but requested ' +
                layerSpec.tileType + ' tile type');
    return false;
  }

  // It's okay to only have one of mercator and cartogram specs,
  // but you must have at least one (and the field name, table name,
  // and polyYear all be the same projection type and all be there).
  var hasMercators = layerSpec.mercatorShapeType && layerSpec.mercatorPolyYear;
  var hasCartograms = layerSpec.cartogramShapeType && layerSpec.cartogramPolyYear;
  var hasValidFields = Validator.validateFields(layerSpec,
                               requiredFieldsTable, optionalFieldsTable);
  if (!(hasMercators || hasCartograms) || !hasValidFields) {
    alert('The ' + layerSpec.shortName + ' layer is not valid, alas.');
    return false;
  }

  return true;
};

// TODO JsDoc
MapeteriaChoroplethLayerSpecFormatSupport.getPointInfoUrl = 
  function(layerSpec) {
  
  if(!layerSpec.pointInfoUrl) {
    return null;
  }
  params = getClickHandlerQueryStringParameters(layerSpec);

  return layerSpec.pointInfoUrl + params;

}
