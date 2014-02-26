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
function DomCreator ( mapApplicationInfo ) {
  this.mai = mapApplicationInfo // shortened for typing
}

// Creates a selector object for a layer type (e.g. 
// dot layers) based on how many layer specs of that type there are.
// If there are 0, don't show a control.
// If there are exactly 1, show a checkbox.
// If there are >1, show a dropdown (plus a checkbox to turn them all off/on).
// Returns a div containing a new selector control plus any explanatory text
// @@@ Would it make more sense to create elements, then just hide
// @@@ them if they are not used / there is not data for them?
DomCreator.prototype.createLayerSelectorControl = function ( layerTypeName) {

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

      layerSelectionCheckbox.checked = true
      layerSelectionCheckbox.type = 'checkbox'
      layerSelectionCheckbox.id = layerTypeName + 'Checkbox'
      var layerDescriptionSpan = document.createElement('span');

      if( layersCount == 1) {
        layerSelectionCheckbox.value = lastKey
        var longerDescription = 'Show '+layerSpecs[key].shortDescription+'<p />'
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
        selectElement.id = layerTypeName + 'Select'
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
DomCreator.prototype.createAndPopulateElements = function (map) {
  document.title = mapApplicationInfo.pageTitle
  
  $( '#explanation').html( "<b>" + this.mai.pageTitle + "</b><p>" 
                           + this.mai.pageDescription + "<p>")

  
  // Add the dot layer selector (if needed)
  var dotSelector = this.createLayerSelectorControl("dotLayers")
  $( '#dotLayers' ).append(dotSelector)

  // Add the choropleth layer selector (if needed)
  var choroplethSelector = this.createLayerSelectorControl('choroplethLayers')
  $( '#choroplethLayers' ).append(choroplethSelector)

  // Add the border layer selector (if needed)
  var borderSelector = this.createLayerSelectorControl('borderLayers')
  $( '#borderLayers' ).append(borderSelector)

  // Sharing URL should start out pointing to here
  $( '#sharingUrl' )[0].href = '#'

  // Allow switching between cartogram and not

  if (this.mai.hasOwnProperty('hasCartogram') &&
      (this.mai.hasCartogram != undefined) && 
      this.mai.hasCartogram) {
     var cartogramCheckbox = 
           '<input type="checkbox" id="isCartogramCheckbox" checked>'
     var cartogramText = 'Show as cartogram<p />'
    $( '#cartogramSelector' ).append(cartogramCheckbox + cartogramText)
  }

  // Set up the map
  map.setView([this.mai.startingCenterLat, this.mai.startingCenterLng],
              this.mai.startingCenterZoom)

  // Set up the marker
  // TODO @@@ The marker needs to get into higher scope, maybe 
  // the marker gets set one level up?
  if (this.mai.hasOwnProperty('startingMarkerLat') &&
      (this.mai.startingMarkerLat != undefined)) {
    L.marker([this.mai.startingMarkerLat, this.mai.startingMarkerLng])
        .bindPopup("Fetching data, please wait...")
        .addTo(map)
  }

}

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

console.log("legend url is" + url)
  this.src = url;

}

