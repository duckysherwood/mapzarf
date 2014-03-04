// @author Kaitlin Duck Sherwood
// I tried to set the value of a checkbox to null if it was
// multiple, but the value ended up being "on" (<- literally, 'o'+'n').
// So I'm going to set a sentinel value instead.  It needs to be global
// so that BehaviourCreator can see it.
/* @const */ SENTINEL_MULTIPLE = ""

/** @class DomCreator
 *  @classdesc This class sets up the DOM for the map application.
 *  The DomCreator depends, by convention, on a number of DOM 
 *  elements being created before this point in the view (i.e. the HTML).  
 *  These include elements named
 *   explanation (p)
 *   sharingUrl (a)
 *   choroplethLayers (div)
 *   dotLayers (div)
 *   borderLayers (div)
 *   showCitiesCheckbox (input)
 *   cartogramSelector (div)
 *  At the moment, this code assumes that there will only be one map
 *  element on the page, but it probably wouldn't be *too* difficult 
 *  to instanttiate two different maps (with two different sets of controls).
 */
// TODO check for existence of all the named elements

/** 
 *  @constructor
 *  @this {DomCreator}
 *  @param map {object} Leaflet map object, e.g. L.map
 *  @param mapApplicationInfo {object} JSON describing the application,
 *    especially the layers to go on the map
 *  @param pageInitValues {object} Information on how to set the UI controls
 *    on startup
 */
function DomCreator ( map, mapApplicationInfo, pageInitValues ) {
  /** @private */ this.mai = mapApplicationInfo; // shortened for typing
  /** @private */ var closurePageInitValues = pageInitValues;
  /** @private */ var closureMap = map;
  
  // @@@ Would it make more sense to create elements, then just hide
  // @@@ them if they are not used / there is not data for them?

  /** Creates the controls for a particular layer type (e.g. dot layer)
   *    based on the values in the mapApplicationInfo.  Can contain a 
   *    checkbox, a checkbox and a selector, or neither.
   *  @param layerTypeName {string} Name of the type of layer, e.g. 'dotLayers'
   *  @returns a div with the appropriate controls (as HTML elements)
   *    or null if there are no layers
   */
  // TODO da-yam this is a long method.  Can I split it up?
  /** @private */ this.createLayerSelectorControl = function( layerTypeName) {
  
    if(layerTypeName in this.mai) { 
      var layerSpecs = this.mai[layerTypeName];
      var $layerDiv = $( layerSpecs );
      if( $layerDiv == undefined ) {
        console.log('Missing div for ' + layerTypeName + ', failing softly.');
        return null;
      }
  
      if (layerSpecs != undefined) {
        var layerSelectionControl;
  
        // I can't just do a layerSpecs.length to get the number
        // of layers; I need to know if there are 0, exactly 1, or 
        // more than one layers in this layerSpec.
        var layersCount = 0;
        var lastKey;
        for (var key in layerSpecs) {
          layersCount++;
          lastKey = key;
          if(layersCount > 1) break;
        }
  
        if(layersCount == 0) {
          return null;
        }
  
        layerSelectionControl = document.createElement('div');
        layerSelectionControl.id = layerTypeName + 'Control';
  
        // Checkbox to turn all the layers on or off
        layerSelectionCheckbox = document.createElement('input');
        layerSelectionControl.appendChild (layerSelectionCheckbox);
        layerSelectionCheckbox.id = layerTypeName + 'Checkbox';
  
        layerSelectionCheckbox.type = 'checkbox';
        layerSelectionCheckbox.checked = true;

        var layerDescriptionSpan = document.createElement('span');
  
        if( layersCount == 1) {
          layerSelectionCheckbox.value = lastKey;
          var longerDescription ='Show ' 
               // + layerSpecs[key].shortDescription + '<br />';
          layerDescriptionSpan.innerHTML = longerDescription;
          layerSelectionControl.appendChild(layerDescriptionSpan);
          var descriptionElem = document.createElement('span');
          descriptionElem.innerHTML = descriptionHtml(layerSpecs[key]);
          descriptionElem.id = layerTypeName + 'Description';
          descriptionElem.className = 'indented';
          layerSelectionControl.appendChild(descriptionElem);
  
        } else {
          
          // When I tried making value=null, value was instead ="on".  ???
          layerSelectionCheckbox.value = SENTINEL_MULTIPLE;
  
          layerDescriptionSpan.innerHTML = 'Show ' 
            + layerTypeName.replace('Layer', ' layer') + ': <br />';
          layerSelectionControl.appendChild(layerDescriptionSpan);
          var selectElement = document.createElement('select');
          selectElement.className = 'indented';
          selectElement.id = layerTypeName + 'Selector';
          layerSelectionControl.appendChild(selectElement);
          layerSelectionControl.appendChild(document.createElement('br'));
  
          var alreadySelected = false;
          for (var key in layerSpecs) {
            if (layerSpecs.hasOwnProperty(key)) {
               var optionElement = document.createElement('option');
               optionElement.className = layerTypeName + 'Option';
               optionElement.text = layerSpecs[key].shortDescription;
               optionElement.setAttribute['id'] = key;
               optionElement.value = key;
               selectElement.appendChild(optionElement);
               if(!alreadySelected) {
                 alreadySelected = true;
                 optionElement.selected = true;
                 var descriptionElem = document.createElement('span');
                 descriptionElem.id = layerTypeName + 'Description';
                 var spec = layerSpecs[key];
                 descriptionElem.innerHTML = descriptionHtml(spec);
                 descriptionElem.className = 'indented';
                 layerSelectionControl.appendChild(descriptionElem);
               }
             }
          }
        }
        return layerSelectionControl;
      }
    }
    return null
  }
  
  /** Creates and initializes all the DOM elements relating to the
   *  map which depend upon the mapApplicationInfo.
   *
   *  @public 
   */
  // TODO this is honkin' long, maybe break it up into different
  // pieces?
  this.createAndPopulateElements = function () {

    document.title = mapApplicationInfo.pageTitle
    
    $( '#explanation').html( "<b>" + this.mai.pageTitle + "</b><p>" 
                             + this.mai.pageDescription + "<p>");
  
    
    // Add the dot layer selector (if needed)
    var dotSelector = this.createLayerSelectorControl("dotLayers");
    if(dotSelector) {
      $( '#dotLayers' ).append(dotSelector);
    }
    var $dotLayersCheckbox = $( '#dotLayersCheckbox');
    if($dotLayersCheckbox) {
      var checkedBool = closurePageInitValues['showDots'];
      $dotLayersCheckbox.prop('checked', checkedBool);

      if(closurePageInitValues.dotIndex) {
        $( '#dotLayersSelector' ).
          prop('selectedIndex', closurePageInitValues.dotIndex);
      }
    }
  

    // Add the choropleth layer selector (if needed)
    var choroplethSelector = this.createLayerSelectorControl('choroplethLayers');
    if(choroplethSelector) {
      $( '#choroplethLayers' ).append(choroplethSelector);
    }

    // Initialize the selector (if needed)
    var $choroplethLayersCheckbox = $( '#choroplethLayersCheckbox');
    if($choroplethLayersCheckbox) {
      var checkedBool = closurePageInitValues['showChoropleths']
      $choroplethLayersCheckbox.prop('checked', checkedBool);

      if(closurePageInitValues.choroplethIndex) {
        $( '#choroplethLayersSelector' ).
          prop('selectedIndex', closurePageInitValues.choroplethIndex);
      }
    }

  
    // Add the border layer selector (if needed)
    var borderSelector = this.createLayerSelectorControl('borderLayers');
    if(borderSelector) {
      $( '#borderLayers' ).append(borderSelector);
    }

    var $borderLayersCheckbox = $( '#borderLayersCheckbox' );
    if($borderLayersCheckbox) {
      var checkedBool = closurePageInitValues['showBorders'];
      $borderLayersCheckbox.prop('checked', checkedBool);
    }
    // TODO what about border slection box?
  
    $( '#sharingUrl' )[0].href = '#';
  
    // Allow switching between cartogram and not
  
    if (this.mai.hasOwnProperty('hasCartogram') &&
        (this.mai.hasCartogram != undefined) && 
        this.mai.hasCartogram) {
       var cartogramCheckboxString;
       if(closurePageInitValues.cartogram) {
         cartogramCheckboxString = '<input type="checkbox" id="isCartogramCheckbox" checked>';
       } else {
         cartogramCheckboxString = '<input type="checkbox" id="isCartogramCheckbox" >'; // TODO clean up
       }
       var cartogramText = 'Show as cartogram<p />'
       $( '#cartogramSelector' ).append(cartogramCheckboxString + cartogramText);
    }
  
    // Set up the map
    closureMap.setView([closurePageInitValues.lat, closurePageInitValues.lng], 
                 closurePageInitValues.zoom);
  

    $( '#showCitiesCheckbox').prop('checked', closurePageInitValues.showCities);
  }
  
  // put the legend update on the legend image
  $( '#legendImage' )[0].update = function (layerSpec) {
    url = "../../mapeteria2/makeLegend.php?lbl=y&o=p" +
         "&minValue=" + layerSpec.minValue +
         "&maxValue=" + layerSpec.maxValue +
         "&minColour=" + layerSpec.minColor +
         "&maxColour=" + layerSpec.maxColor +
         "&mapping=" + layerSpec.mapping ;
  
    if(layerSpec.hasOwnProperty('isPercentage')) {
      if(layerSpec.isPercentage) {
        url += "&pct=y";
      }
    }
  
    this.src = url;
  
  }

  // Put in the attribution
  $('#attribution').append(', page customized by ' + this.mai.attribution);

}
