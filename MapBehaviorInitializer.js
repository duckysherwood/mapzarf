// Want to add behaviour to the leaflet map, including
// change to cartogram
// change dot layer
// change choropleth layer
// change city markers
// BehaviourCreator adds behaviour to everything, including the map

function MapBehaviorInitializer(aMap, mapApplicationInfo) {
  this.map = aMap
  this.map.mai = mapApplicationInfo
  this.dotLayer = null
  this.borderLayer = null
  this.choroplethLayer = null

  this.map.updateLayers = function () { 
    
    // needed because "this" in the $.each is the layer
    var thisMap = this  
  

    $.each([this.dotLayer, this.borderLayer, this.choroplethLayer],
           function (index, layer) {
             if((layer != null) && (layer != undefined)) {
               thisMap.removeLayer(layer)
             }
           })

    this.dotLayer = this.getDotLayer()
    this.borderLayer = this.getBorderLayer()
    this.choroplethLayer = this.getChoroplethLayer()

    $.each([this.choroplethLayer, this.borderLayer, this.dotLayer],
           function (index, layer) {
             if((layer != null) && (layer != undefined)) {
               thisMap.addLayer(layer)
             }
           })
  }


  this.map.projectionType = function () {
    return 'cartogram' // @@@ TODO fix to check the checkbox
  }

  this.map.getChoroplethLayer = function () {
    return this.getPolygonLayer('choroplethLayers', false);
  }

  this.map.getBorderLayer = function () {
    return this.getPolygonLayer('borderLayers', true);
  }

  // Used for both choropleth layer and border layer
  this.map.getPolygonLayer = function (layerTypeName, showBorder) {
    if(!this.layerSpecExists(layerTypeName)) {
      return null
    }

    var key = this.findSelectedKeyForLayerType(layerTypeName)
    var layerSpec = this.mai[layerTypeName][key] 

    var url = "../../mapeteria2/choropleth.phpx?x={x}&y={y}&zoom={z}&";

    url += 'polyType=' + this.mai[this.projectionType() + 'ShapeType']
    url += '&polyYear=' + this.mai[this.projectionType() + 'PolyYear']
    url += '&table=' + layerSpec.table
    url += '&field=' + layerSpec.fieldName
    url += '&year=' + layerSpec.year

    // border layers don't have these
    // TODO look for each one before printing it out, which probably means 
    // TODO writing a helper method
    if(layerSpec.hasOwnProperty('minValue')) {
      url += '&minValue=' + layerSpec.minValue
      url += '&maxValue=' + layerSpec.maxValue
      url += '&minColor=' + layerSpec.minColor
      url += '&maxColor=' + layerSpec.maxColor
    }
    url += '&mapping=' + layerSpec.mapping

    // @@@ I suppose I could also check for null or undefined...
    if(layerSpec.hasOwnProperty('normalizerType') &&
       layerSpec.hasOwnProperty('normalizerField') &&
       layerSpec.hasOwnProperty('normalizerYear') ) {
      url += '&normalizer=' + layerSpec.normalizerField
      url += '&normalizerType=' + layerSpec.normalizerType
      url += '&normalizerYear=' + layerSpec.normalizerYear
    } else {
      url += '&normalizer=n' 
      url += '&normalizerYear=1'
      url += '&normalizerField=null'
    }

    if(showBorder) {
      var borderWidth = 1
      if(layerSpec.hasOwnProperty('borderWidth')) {
        borderWidth = layerSpec.borderWidth
      }
      url += "borderColor="+layerSpec.borderColor
             + "&border=solid&width="+layerSpec.borderWidth;
    }
       
    console.log('Polygon url for ' + layerTypeName + ' is ' + url)
    return L.tileLayer(url, {
      maxZoom: 18,
      attribution: layerSpec['source']
    });

  }

  this.map.getDotLayer = function () {
    var layerTypeName = 'dotLayers'
    if(!this.layerSpecExists('dotLayers')) {
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
    if($( checkboxId ) == undefined) {
      return false
    }

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

  this.initialize = function () {
    this.map.updateLayers()
  }

}






