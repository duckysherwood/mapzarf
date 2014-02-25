// The DomCreator populates and initalizes the DOM.  It takes
// a JSON object which describes basically everything about the
// map.
// The DomCreator depends, by convention, on a number of DOM 
// elements being laid out in the view (i.e. the HTML).  These
// include elements named
//   explanation (p)
//   sharingUrl (a)
//   polygonLayers (div)
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
    var layerDiv = $( layerSpecs )
    if( layerDiv == undefined ) {
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
      layerSelectionCheckbox.name = layerTypeName + 'Checkbox'
      var layerDescriptionSpan = document.createElement('span');

      if( layersCount == 1) {
        layerSelectionCheckbox.value = lastKey
        var longerDescription = 'Show '+layerSpecs[key].shortDescription+'<p />'
        layerDescriptionSpan.innerHTML = longerDescription
        // @@@ TODO why appended out of order?
        layerSelectionControl.appendChild(layerDescriptionSpan)

      } else {
        
        layerSelectionCheckbox.value = '' // don't-care
        layerDescriptionSpan.innerHTML = 'Show ' + layerTypeName + ': <br />'
        layerSelectionControl.appendChild(layerDescriptionSpan)
        var selectElement = document.createElement('select')
        selectElement.className = 'indented'
        layerSelectionControl.appendChild(selectElement)

        var alreadySelected = false
        for (var key in layerSpecs) {
          if (layerSpecs.hasOwnProperty(key)) {
             var optionElement = document.createElement('option')
             optionElement.text = layerSpecs[key].shortDescription
             optionElement.setAttribute['id'] = key
             optionElement.value = key
             selectElement.appendChild(optionElement)
             if(!alreadySelected) {
               alreadySelected = true
               optionElement.selected = true
               var descriptionElem = document.createElement('span')
               var spec = layerSpecs[key]
               var descriptionText = '<br /><a href="' + spec.sourceUrl + '">'
                                     + spec.description + '</a> ' 
                                     + '(' + spec.year + ', '
                                     + spec.source + ')<p>'
               descriptionElem.innerHTML = descriptionText
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

