// Want to add behaviour to the leaflet map, including
// change to cartogram
// change dot layer
// change choropleth layer
// change city markers
// BehaviourCreator adds behaviour to everything, including the map

function BehaviourCreator(aMap, mapApplicationInfo) {
  this.map = aMap
  this.map.mai = mapApplicationInfo

  this.map.changeDotLayer = function () {
    // TODO put in error checks
  }

  this.map.projectionType = function () {
    return 'cartogram' // @@@ TODO fix to check the checkbox
  }

  this.map.getChoroplethLayer = function () {
    return this.getPolygonLayer('choroplethLayers');
  }

  this.map.getBorderLayer = function () {
    return this.getPolygonLayer('borderLayers');
  }

  // Used for both choropleth layer and border layer
  this.map.getPolygonLayer = function (layerTypeName) {
    if(!this.layerSpecExists) {
      return null
    }

    var key = this.findSelectedKeyForLayerType(layerTypeName)
    var layerSpec = this.mai[layerTypeName][key] 

    var url = "../../mapeteria2/choropleth.phpx?x={x}&y={y}&zoom={z}&";

    url += 'polyType=' + this.mai[this.projectionType() + 'ShapeType']
    url += '&polyYear=' + this.mai[this.projectionType() + 'PolyYear']
    url += '&table=' + layerSpec['table']
    url += '&field=' + layerSpec['field']
    url += '&minValue=' + layerSpec['minValue']
    url += '&maxValue=' + layerSpec['maxValue']
    url += '&minColor=' + layerSpec['minColor']
    url += '&maxColor=' + layerSpec['maxColor']

    // @@@ I suppose I could also check for null or undefined...
    if(layerSpec.hasOwnProperty('normalizerType') &&
       layerSpec.hasOwnProperty('normalizerField') &&
       layerSpec.hasOwnProperty('normalizerYear') ) {
      url += '&normalizer=' + layerSpec['normalizerField']
      url += '&normalizerType=' + layerSpec['normalizerType']
      url += '&normalizerYear=' + layerSpec['normalizerYear']
    } else {
      url += '&normalizer=n' 
      url += '&normalizerYear=1'
      url += '&normalizerField=null'
    }

    // NOTE: maybe should have the option for putting a border onto
    // the choropleth tiles
       
    console.log('Polygon url for ' + layerTypeName + ' is ' + url)
    return L.tileLayer(url, {
      maxZoom: 18,
      attribution: layerSpec['source']
    });

  }

  this.map.getDotLayer = function () {
    var layerTypeName = 'dotLayers'
    if(!this.layerSpecExists) {
      return null
    }

    var key = this.findSelectedKeyForLayerType(layerTypeName)
    var layerSpec = this.mai[layerTypeName][key] 
  
    var url = "../../mapeteria2/dots.php?x={x}&y={y}&zoom={z}&";
    url += 'points=' + layerSpec[this.projectionType() + 'Table']
    url += '&name=' + layerSpec[this.projectionType() + 'FieldName'] 
    url += '&year=' + layerSpec['year']
    url += '&colour=' + layerSpec['color']
    url += '&size=' + layerSpec['size']
    url += '&jId=0'	// I think this is just for symmetry with MapRequest
    console.log("URL for dot tile layer is " + url)
  
    return L.tileLayer(url, {
      maxZoom: 18,
      attribution: layerSpec['source']
    });
  }

  this.map.layerSpecExists = function (layerTypeName) {

    var key = this.findSelectedKeyForLayerType(layerTypeName)
    if(key == undefined) {
      console.log('No ' + layerTypeName + ' layer selected, ??')
      return false
    }
  
    var layerSpec = this.mai[layerTypeName][key] 
    if(layerSpec == undefined) {
      console.log('No specification for ' + layerTypeName + "'s " + key 
                  + ' found in the JSON mapApplicationInfo spec')
      return false
    }

    return true
  }


  this.map.findSelectedKeyForLayerType  = function (layerTypeName) {
    var checkboxId = '#' + layerTypeName + 'Checkbox'
    if($( checkboxId ).is(':checked')) {
      var key = $( checkboxId ).val()
  
      if(key == SENTINEL_MULTIPLE) {
        // multiple options, select the one which is checked
        var layerSelectorId = '#' + layerTypeName + 'Select'
        key = $( layerSelectorId ).find(':selected').val()
      } 
      return key
    }
  }

  var dotLayer = this.map.getDotLayer()  // @@@ testing only TODO
  var choroplethLayer = this.map.getChoroplethLayer()  // @@@ testing only TODO
  var borderLayer = this.map.getBorderLayer()  // @@@ testing only TODO

}





