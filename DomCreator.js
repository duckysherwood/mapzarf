// TODO figure out why the layer controls don't appear on the page
// TODO the same order as they are added to the DOM

// TODO figure out how to set the first item in a drop-down as the
// TODO default, instead of the last

// I tried to set the value of a checkbox to null if it was
// multiple, but the value ended up being "on" (<- literally, "o"+"n").
// So I'm going to set a sentinel value instead.  It needs to be global
// so that BehaviourCreator can see it.
SENTINEL_MULTIPLE = ""

// The DomCreator populates and initalizes the DOM.  It takes
// a JSON object which describes basically everything about the
// map.
// The DomCreator depends, by convention, on a number of DOM 
// elements being laid out in the view (i.e. the HTML).  These
// include elements named
//   explanation (p)
//   sharingUrl (a)
//   choroplethLayers (div)
//   dotLayers (div)
//   borderLayers (div)
// TODO check for existence of all the named elements
function DomCreator ( map, mapApplicationInfo, pageInitValues ) {
  this.mai = mapApplicationInfo // shortened for typing
  var closurePageInitValues = pageInitValues
  var closureMap = map
  
  // Creates a selector object for a layer type (e.g. 
  // dot layers) based on how many layer specs of that type there are.
  // If there are 0, don't show a control.
  // If there are exactly 1, show a checkbox.
  // If there are >1, show a dropdown (plus a checkbox to turn them all off/on).
  // Returns a div containing a new selector control plus any explanatory text
  // @@@ Would it make more sense to create elements, then just hide
  // @@@ them if they are not used / there is not data for them?
  this.createLayerSelectorControl = function( layerTypeName) {
  
    if(layerTypeName in this.mai) { 
      var layerSpecs = this.mai[layerTypeName]
      var $layerDiv = $( layerSpecs )
      if( $layerDiv == undefined ) {
        console.log('Missing div for ' + layerspec + ', failing softly.')
        return null
      }
  
      if (layerSpecs != undefined) {
        var layerSelectionControl
  
        // I can't just do a layerSpecs.length to get the number
        // of layers; I can't just do a layerSpecs[0] to get
        // the (only) element in case there is only one
        var layersCount = 0
        var lastKey
        for (var key in layerSpecs) {
          layersCount++
          lastKey = key
          if(layersCount > 1) break
        }
  
        if(layersCount == 0) {
          return null
        }
  
        layerSelectionControl = document.createElement('div');
        layerSelectionControl.id = layerTypeName + 'Control'
  
        // Checkbox to turn all the layers on or off
        layerSelectionCheckbox = document.createElement('input');
        layerSelectionControl.appendChild (layerSelectionCheckbox);
        layerSelectionCheckbox.id = layerTypeName + 'Checkbox'
  
        layerSelectionCheckbox.type = 'checkbox'
        layerSelectionCheckbox.checked = true

        var layerDescriptionSpan = document.createElement('span');
  
        if( layersCount == 1) {
          layerSelectionCheckbox.value = lastKey
          var longerDescription ='Show '+layerSpecs[key].shortDescription+'<p />'
          layerDescriptionSpan.innerHTML = longerDescription
          // @@@ TODO why appended out of order?
          layerSelectionControl.appendChild(layerDescriptionSpan)
  
        } else {
          
          // When I tried making value=null, value was instead ="on".  ???
          layerSelectionCheckbox.value = SENTINEL_MULTIPLE
  
          layerDescriptionSpan.innerHTML = 'Show ' + layerTypeName + ': <br />'
          layerSelectionControl.appendChild(layerDescriptionSpan)
          var selectElement = document.createElement('select')
          selectElement.className = 'indented'
          selectElement.id = layerTypeName + 'Selector'
          layerSelectionControl.appendChild(selectElement)
          layerSelectionControl.appendChild(document.createElement('br'))
  
          var alreadySelected = false
          for (var key in layerSpecs) {
            if (layerSpecs.hasOwnProperty(key)) {
               var optionElement = document.createElement('option')
               optionElement.className = layerTypeName + 'Option'
               optionElement.text = layerSpecs[key].shortDescription
               optionElement.setAttribute['id'] = key
               optionElement.value = key
               selectElement.appendChild(optionElement)
               if(!alreadySelected) {
                 alreadySelected = true
                 optionElement.selected = true
                 var descriptionElem = document.createElement('span')
                 descriptionElem.id = layerTypeName + 'Description'
                 var spec = layerSpecs[key]
                 descriptionElem.innerHTML = descriptionHtml(spec)
                 descriptionElem.className = 'indented'
                 layerSelectionControl.appendChild(descriptionElem)
               }
             }
          }
        }
        return layerSelectionControl
      }
    }
    return null
  }
  
  // Creates and initializes all the DOM elements
  this.createAndPopulateElements = function () {
    document.title = mapApplicationInfo.pageTitle
    
    $( '#explanation').html( "<b>" + this.mai.pageTitle + "</b><p>" 
                             + this.mai.pageDescription + "<p>")
  
    
    // Add the dot layer selector (if needed)
    var dotSelector = this.createLayerSelectorControl("dotLayers")
    if(dotSelector) {
      $( '#dotLayers' ).append(dotSelector)
    }
    var $dotLayersCheckbox = $( '#dotLayersCheckbox')
    if($dotLayersCheckbox) {
      var checkedBool = closurePageInitValues['showDots']
      $dotLayersCheckbox.prop('checked', checkedBool)

      if(closurePageInitValues.dotIndex) {
        $( '#dotLayersSelector' ).
          prop('selectedIndex', closurePageInitValues.dotIndex)
      }
    }
  

    // Add the choropleth layer selector (if needed)
    var choroplethSelector = this.createLayerSelectorControl('choroplethLayers')
    if(choroplethSelector) {
      $( '#choroplethLayers' ).append(choroplethSelector)
    }

    // Initialize the selector (if needed)
    var $choroplethLayersCheckbox = $( '#choroplethLayersCheckbox')
    if($choroplethLayersCheckbox) {
      var checkedBool = closurePageInitValues['showChoropleths']
      $choroplethLayersCheckbox.prop('checked', checkedBool)

      if(closurePageInitValues.choroplethIndex) {
        $( '#choroplethLayersSelector' ).
          prop('selectedIndex', closurePageInitValues.choroplethIndex)
      }
    }

  
    // Add the border layer selector (if needed)
    var borderSelector = this.createLayerSelectorControl('borderLayers')
    if(borderSelector) {
      $( '#borderLayers' ).append(borderSelector)
    }

    var $borderLayersCheckbox = $( '#borderLayersCheckbox' )
    if($borderLayersCheckbox) {
      var checkedBool = closurePageInitValues['borderLayers']
      $borderLayersCheckbox.prop('checked', checkedBool)
    }
    // TODO what about border slection box?
  
    $( '#sharingUrl' )[0].href = '#'
  
    // Allow switching between cartogram and not
  
    if (this.mai.hasOwnProperty('hasCartogram') &&
        (this.mai.hasCartogram != undefined) && 
        this.mai.hasCartogram) {
       var cartogramCheckboxString
       if(closurePageInitValues.cartogram) {
         cartogramCheckboxString = '<input type="checkbox" id="isCartogramCheckbox" checked>'
       } else {
         cartogramCheckboxString = '<input type="checkbox" id="isCartogramCheckbox" >' // TODO clean up
       }
       var cartogramText = 'Show as cartogram<p />'
       $( '#cartogramSelector' ).append(cartogramCheckboxString + cartogramText)
    }
  
    // Set up the map
    closureMap.setView([closurePageInitValues.lat, closurePageInitValues.lng], 
                 closurePageInitValues.zoom)
  
    // set up the marker
    if(closurePageInitValues.markerLat) {
      L.marker([closurePageInitValues.markerLat, 
                closurePageInitValues.markerLng])
          .bindPopup("Fetching data, please wait...")
          .addTo(closureMap)
    }
  

    $( '#showCitiesCheckbox').prop('checked', closurePageInitValues.cities)
  }
  
  // put the legend update on the legend image
  $( '#legendImage' )[0].update = function (layerSpec) {
    url = "../../mapeteria2/makeLegend.php?lbl=y&o=p" +
         "&minValue=" + layerSpec.minValue +
         "&maxValue=" + layerSpec.maxValue +
         "&minColour=" + layerSpec.minColor +
         "&maxColour=" + layerSpec.maxColor +
         "&mapping=" + layerSpec.mapping 
  
    if(layerSpec.hasOwnProperty('isPercentage')) {
      if(layerSpec.isPercentage) {
        url += "&pct=y"
      }
    }
  
    this.src = url;
  
  }

}
