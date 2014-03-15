// Sorry about the name being so long.

function MapeteriaChoroplethLayerSpecFormatSupport() {
  console.log("init"); 
};

MapeteriaChoroplethLayerSpecFormatSupport.getLayerUrl = function(layerSpec, projection) {

  var shapeType = layerSpec[projection + 'ShapeType'];
  var polyYear = layerSpec[projection + 'PolyYear'];
  if (!shapeType || !polyYear) {
    alert("There is no information for the " + layerSpec.shortDescription +
          " layer for the " + projection + " projection.");
    return null; 
  } 

  var url = BINDIR + "/choropleth.phpx?x={x}&y={y}&zoom={z}&";

  url += 'polyType=' + layerSpec[projection + 'ShapeType'];
  url += '&polyYear=' + layerSpec[projection + 'PolyYear'];
  url += '&table=' + layerSpec.table;
  url += '&field=' + layerSpec.fieldName;
  url += '&year=' + layerSpec.year; 

    
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
  if(layerSpec.hasOwnProperty('minValue')) {
    url += '&minValue=' + layerSpec.minValue;
    url += '&maxValue=' + layerSpec.maxValue;
    url += '&minColor=' + layerSpec.minColor;
    url += '&maxColor=' + layerSpec.maxColor;
  }
  url += '&mapping=' + layerSpec.mapping;

  if(layerSpec.showBorder) {
    var borderWidth = 1;
    if(layerSpec.hasOwnProperty('borderWidth')) {
      borderWidth = layerSpec.borderWidth;
    }
    url += "&borderColor="+layerSpec.borderColor +
           "&border=solid&width="+layerSpec.borderWidth;
  }

  return url;

};


MapeteriaChoroplethLayerSpecFormatSupport.validate = function(layerSpec) {
  var requiredFieldsTable = {'tileEngine' : 'word',
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
                             'mapping' : 'text',
                             'showBorder' : 'bool',
                             'sourceUrl' : 'url',
                             'source' : 'text'};

  if(!layerSpec.tileEngine) {
    console.log('Tile type not specified for choropleth layer');
    return false;
  }

  if(layerSpec.tileEngine != 'mapeteriaChoropleth') {
    console.log('Called choropleth class but requested ' + 
                layerSpec.tileType + " tile type");
    return false;
  }

  // It's okay to only have one of mercator and cartogram specs,
  // but you must have at least one (and the field name, table name,
  // and polyYear all be the same projection type and all be there).
  var hasMercators = layerSpec.mercatorShapeType && layerSpec.mercatorPolyYear;
  var hasCartograms = layerSpec.mercatorShapeType && layerSpec.mercatorPolyYear;
  if(!(hasMercators || hasCartograms)) {
    console.log("hasMercators: " + hasMercators);
    console.log("hasCartograms: " + hasCartograms);
    return false;
  }

  return Validator.validateFields(layerSpec, 
                               requiredFieldsTable, optionalFieldsTable);

};

