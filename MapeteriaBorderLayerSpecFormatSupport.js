// Sorry about the name being so long.

function MapeteriaBorderLayerSpecFormatSupport() {
};

// This translates the border layerspec to 
MapeteriaBorderLayerSpecFormatSupport.asChoroplethLayerSpec = 
  function(layerSpec) {

  if(!layerSpec) {
    return null;
  }

  var fieldsToCopy = ['tileEngineVersion', 'table', 'year', 'borderColor', 
                      'borderWidth', 'borderColor',
                      'shortDescription', 'description', 
                      'source', 'sourceUrl', 
                      'mercatorShapeType', 'mercatorPolyYear',
                      'cartogramShapeType', 'cartogramPolyYear']

  var fakeSpec = {};
  $.each(fieldsToCopy, function(index, value) {
    if(layerSpec[value]) {
      fakeSpec[value] = layerSpec[value];
    }
  });

  fakeSpec.fieldName = 'jurisdictionId';
  fakeSpec.mapping = 'none';
  fakeSpec.showBorder = true;

  // There needs to be *some* min/max color to keep the validator happy.
  if(!layerSpec.minColor) {
    fakeSpec.minColor = "ffffff";
  }
  if(!layerSpec.maxColor) {
    fakeSpec.maxColor = "000000";
  }
  if(!layerSpec.minValue) {
    fakeSpec.minValue = 1;
  }
  if(!layerSpec.maxValue) {
    fakeSpec.maxValue = 1;
  }
  return fakeSpec;

};

MapeteriaBorderLayerSpecFormatSupport.getLayerUrl = function(layerSpec, projection) {

  var fakeSpec =  MapeteriaChoroplethBorderLayerSpecFormatSupport
                               .asChoroplethLayerSpec(layerSpec);
  return MapeteriaChoroplethBorderLayerSpecFormatSupport.getLayerUrl(fakeSpec);

};


MapeteriaBorderLayerSpecFormatSupport.validate = function(layerSpec) {
  var requiredFieldsTable = {'tileEngine' : 'word',
                             'tileEngineVersion' : 'float',
                             'table' : 'word',
                             'year' : 'int',
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
                             'sourceUrl' : 'url',
                             'source' : 'text'};

  if(!layerSpec.tileEngine) {
    console.log('Tile type not specified for border layer');
    return false;
  }

  if(layerSpec.tileEngine != 'mapeteriaBorder') {
    console.log('Called border class but requested ' + 
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



