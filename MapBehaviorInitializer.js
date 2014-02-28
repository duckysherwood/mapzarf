// TODO move to a separate class?
// Want to add behaviour to the leaflet map, including
// change to cartogram
// change dot layer
// change choropleth layer
// change city markers
// BehaviourCreator adds behaviour to everything, including the map

function MapBehaviorInitializer(aMap, mapApplicationInfo, aCityLabeller) {
  this.map = aMap
  this.map.mai = mapApplicationInfo
  this.cityLabeller = aCityLabeller

  this.dotLayer = null
  this.borderLayer = null
  this.choroplethLayer = null

  var closureCityLabeller = aCityLabeller
  var closureMap = aMap
  this.map.on("zoomend", function () {
    closureCityLabeller.refreshCityLabels(closureCityLabeller)
    $( '#sharingUrl' )[0].href = closureMap.getSharingUrl()
  })

  this.map.on("dragend", function () {
    closureCityLabeller.refreshCityLabels(closureCityLabeller)
    $( '#sharingUrl' )[0].href = closureMap.getSharingUrl()
  })

  var closureMap = this.map
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
    if( $( '#isCartogramCheckbox' ).is(':checked')) {
      return 'cartogram' 
    } else {
      return 'mercator'
    }
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

    if(!$( '#' + layerTypeName + 'Checkbox').is(':checked')) {
      return null
    }

    var key = this.findSelectedKeyForLayerType(layerTypeName)
    var layerSpec = this.mai[layerTypeName][key] 

    var url = "../../mapeteria2/choropleth.phpx?x={x}&y={y}&zoom={z}&";

    url += 'polyType=' + layerSpec[this.projectionType() + 'ShapeType']
    url += '&polyYear=' + layerSpec[this.projectionType() + 'PolyYear']
    url += '&table=' + layerSpec.table
    url += '&field=' + layerSpec.fieldName
    url += '&year=' + layerSpec.year


    // @@@ I suppose I could also check for null or undefined...
    if(layerSpec.hasOwnProperty('normalizerType') &&
       layerSpec.hasOwnProperty('normalizerField') &&
       layerSpec.hasOwnProperty('normalizerYear') ) {
      url += '&normalizer=' + layerSpec.normalizerField
      url += '&normalizerType=' + layerSpec.normalizerType
      url += '&normalizerYear=' + layerSpec.normalizerYear
    } else {
      url += '&normalizer=null' 
      url += '&normalizerYear=1'
      url += '&normalizerType=n'
    }

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

    if(showBorder) {
      var borderWidth = 1
      if(layerSpec.hasOwnProperty('borderWidth')) {
        borderWidth = layerSpec.borderWidth
      }
      url += "&borderColor="+layerSpec.borderColor
             + "&border=solid&width="+layerSpec.borderWidth;
    }

    if(layerTypeName == "choroplethLayers") {
      $( '#legendImage' )[0].update(layerSpec)
    }
       
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

    if(!$( '#dotLayersCheckbox').is(':checked')) {
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
        var layerSelectorId = '#' + layerTypeName + 'Selector'
        key = $( layerSelectorId ).find(':selected').val()
      } 
      return key
    }
  }

  this.initialize = function () {
    this.map.updateLayers()
  }

  // This URL will re-create the map as it exists at a given point,
  // so you can more easily call attention to certain features on the map.
  this.map.getSharingUrl = function() {
     var url = location.origin + location.pathname;
     var latlng = closureMap.getCenter();
  
     url += "?lat=" + latlng.lat;
     url += "&lng=" + latlng.lng;
     url += "&zoom=" + closureMap.getZoom();

     url += "&cartogram=" + getFlagForCheckbox('#isCartogramCheckbox')
     var citiesFlag =  getFlagForCheckbox('#showCitiesCheckbox')
     url += "&showCities=" + citiesFlag
  
     // @@@
     /*
     if(typeof jurisdictionMarker !== 'undefined') {
       url += "&markerLat=" + jurisdictionMarker.getLatLng().lat;
       url += "&markerLng=" + jurisdictionMarker.getLatLng().lng;
     }
     */
  
     var $showChoroplethsCheckbox = $( '#choroplethLayersCheckbox' ).first()[0]
     if($showChoroplethsCheckbox) {
       url += "&showChoropleths=" 
              + getFlagForCheckbox('#choroplethLayersCheckbox');
     }

     var $choroplethLayersSelector = $( '#choroplethLayersSelector' ).first()[0]
     if($choroplethLayersSelector) {
       url += "&choroplethIndex=" 
              + (parseInt($choroplethLayersSelector.selectedIndex));
     }

     var showDotsCheckbox = $( '#dotLayersCheckbox' ).first()[0]
     if(showDotsCheckbox) {
       url += "&showDots=" + getFlagForCheckbox('#dotLayersCheckbox');
     }
     var $dotsLayersSelector = $( '#dotsLayersSelector' ).first()[0]
     if($dotsLayersSelector) {
       url += "&dotIndex=" 
              + (parseInt($dotsLayersSelector.selectedIndex));
     }
  
     // borders are sometimes selected with a combobox instead of checkboxes
     var bordersCheckbox = $( '#borderLayersCheckbox' ).first()[0]
     var bordersSelector = $( '#borderLayersSelector' ).first()[0]
     if(bordersCheckbox) {
       url += "&showBorders=" + getFlagForCheckbox('#borderLayersCheckbox');
     }

     /* 
     if( typeof countyBordersCheckbox != "undefined" ) {
       url += "&counties=" + getFlagForCheckbox(countyBordersCheckbox);
     }
     */
  
     /*
     // Year and month are not always set
     if( typeof yearCombo != "undefined" ) {
       url += "&year=" + yearCombo.value;
     }
     if( typeof monthCombo != "undefined" ) {
       url += "&month=" + (parseInt(monthCombo.selectedIndex)+1);
     }
     */
     
     return url
  }

  function getFlagForCheckbox(checkboxElementName) {
     var element = $( checkboxElementName )
     if(!element) {
       return 'f'
     }

     return isChecked = $( checkboxElementName ).is(':checked') ? 't' : 'f'
  }

}






