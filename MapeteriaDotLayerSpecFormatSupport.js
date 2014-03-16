// Sorry about the name being so long.

function MapeteriaDotLayerSpecFormatSupport() {
};


MapeteriaDotLayerSpecFormatSupport.getLayerUrl = function(layerSpec, projection) {
    var url = BINDIR + "/dots.php?x={x}&y={y}&zoom={z}&";
    url += 'points=' + layerSpec[projection + 'Table'];
    url += '&name=' + layerSpec[projection + 'FieldName'];
    url += '&year=' + layerSpec.year;
    url += '&colour=' + layerSpec.color;
    url += '&size=' + layerSpec.size;
    url += '&jId=0';    // I think this is just for symmetry with MapRequest

    return url;
};


MapeteriaDotLayerSpecFormatSupport.validate = function(layerSpec) {
  var requiredFieldsTable = {'tileEngine' : 'word',
                             'tileEngineVersion' : 'float',
                             'year' : 'int',
                            };
  var optionalFieldsTable = {'color' : 'color',
                             'size' : 'int',
                             'mercatorPoints' : 'word',
                             'cartogramPoints' : 'word',
                            };

  if(!layerSpec.tileEngine) {
    console.log(layerSpec);
    console.log('Tile type not specified for dot layer');
    return false;
  }

  if(layerSpec.tileEngine != 'mapeteriaDot') {
    console.log('Called dot class but requested ' + 
                layerSpec.tileType + " tile type");
    return false;
  }

  // It's okay to only have one of mercator and cartogram table,
  // but you must have at least one.
  var hasMercators = layerSpec.mercatorPoints;
  var hasCartograms = layerSpec.cartogramPoints;
  if(!(hasMercators || !hasCartograms)) {
    console.log("hasMercators: " + hasMercators);
    console.log("hasCartograms: " + hasMercators);
    return false;
  }

  return Validator.validateFields(layerSpec, 
                               requiredFieldsTable, optionalFieldsTable);

};



