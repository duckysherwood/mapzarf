// @author Kaitlin Duck Sherwood
// I tried to set the value of a checkbox to null if it was
// multiple, but the value ended up being "on" (<- literally, 'o'+'n').
// So I'm going to set a sentinel value instead.  It needs to be global
// so that BehaviourCreator can see it.
/* @const */ SENTINEL_MULTIPLE = '';

// This is only because Ducky Sherwood's directory structure is
// different on test and production servers.  Annoying.
/* @const */ BINDIR = '/maps/mapeteria2';

/** @class DomElementAppender
 *  @classdesc This class sets up the DOM for the map application.
 *  The DomElementAppender depends, by convention, on a number of DOM
 *  elements being created before this point in the view (i.e. the HTML).
 *  These include elements named
 *   explanation (p)
 *   sharingUrl (a)
 *   layerControls (div)
 *   showCitiesCheckbox (input)
 *   cartogramSelector (div)
 *  At the moment, this code assumes that there will only be one map
 *  element on the page, but it probably wouldn't be *too* difficult
 *  to instanttiate two different maps (with two different sets of controls).
 */

/**
 *  @constructor
 *  @this {DomElementAppender}
 *  @param map {object} Leaflet map object, e.g. L.map
 *  @param mapApplicationInfo {object} JSON describing the application,
 *    especially the layers to go on the map
 *  @param pageInitValues {object} Information on how to set the UI controls
 *    on startup
 */
function DomElementAppender(map, mapApplicationInfo, pageInitValues ) {
  // omai is "ordered MAI"
  /** @private */ this.omai = mapApplicationInfo; // shortened for typing
  /** @private */ var closurePageInitValues = pageInitValues;
  /** @private */ var closureMap = map;

  // @@@ Would it make more sense to create elements, then just hide
  // @@@ them if they are not used / there is not data for them?

  /** Creates the controls for a particular layer type (e.g. dot layer)
   *    based on the values in the mapApplicationInfo.  Can contain a
   *    checkbox, a checkbox and a selector, or neither.
   *  @param layersetName {string} Name of the type of layer, e.g. 'dotLayers'
   *  @return a div with the appropriate controls (as HTML elements)
   *    or null if there are no layers
   *  @private
   */
  // TODO da-yam this is a long method.  Can I split it up?
  this.createLayerSelectorControl = function(layerset) {
    var layersetName = layerset.shortName;

    // It sort of makes me grind my teeth to have the JSON call
    // them "layers" instead of "layerSpecs", but User doesn't care
    // about the distinction.  :-(
    var layerSpecsArray = layerset.layers;
    var $layerDiv = $('layerControls');
    if (!$layerDiv) {
      console.log('Warning: Missing layers div');
      return null;
    }

    if (layerSpecsArray) {
      var layerSelectionControl;

      var layersCount = layerSpecsArray.length;

      if (layersCount === 0) {
        console.log('Warning: no layers for layerset ' + layerset.name);
        return null;
      }

      layerSelectionControl = document.createElement('div');
      layerSelectionControl.id = layersetName + 'Control';

      // Checkbox to turn all the layers on or off
      var layerSelectionCheckbox = document.createElement('input');
      layerSelectionControl.appendChild(layerSelectionCheckbox);
      layerSelectionCheckbox.id = layersetName + 'Checkbox';
      layerSelectionCheckbox.className = 'layersetCheckbox';

      layerSelectionCheckbox.type = 'checkbox';
      layerSelectionCheckbox.checked = true;

      var layerDescriptionLabel = document.createElement('label');
      layerDescriptionLabel.htmlFor = layersetName + 'Checkbox';

      var descriptionElem;
      if (layersCount == 1) {
        layerSelectionCheckbox.value = layerSpecsArray[0].shortName;

        layerDescriptionLabel.innerHTML = 'Show ' +
           Utilities.descriptionHtml(layerSpecsArray[0]);
        layerDescriptionLabel.id = layersetName + 'Description';
        layerDescriptionLabel.className = 'indented';

        layerSelectionControl.appendChild(layerDescriptionLabel);

      } else {

        // When I tried making value=null, value was instead ="on".  ???
        layerSelectionCheckbox.value = SENTINEL_MULTIPLE;

        layerDescriptionLabel.innerHTML = 'Show ' + layerset.displayName +
                                          ' layers: <br />';
        layerSelectionControl.appendChild(layerDescriptionLabel);
        var selectElement = document.createElement('select');
        selectElement.className = 'indented';
        selectElement.id = layersetName + 'Selector';
        layerSelectionControl.appendChild(selectElement);
        layerSelectionControl.appendChild(document.createElement('br'));

        var alreadySelected = false;
        $.each(layerSpecsArray, function(index, layerSpec) {
           var optionElement = document.createElement('option');
           optionElement.className = layersetName + 'Option';
           optionElement.text = layerSpec.shortDescription;
           optionElement.setAttribute.id = layerSpec.shortName;
           optionElement.value = layerSpec.shortName;
           selectElement.appendChild(optionElement);
           if (!alreadySelected) {
             alreadySelected = true;
             optionElement.selected = true;
             descriptionElem = document.createElement('span');
             descriptionElem.id = layersetName + 'Description';
             descriptionElem.innerHTML =
                  Utilities.descriptionHtml(layerSpec);
             descriptionElem.className = 'indented';
             layerSelectionControl.appendChild(descriptionElem);
           }
        });
      }
      return layerSelectionControl;
    }
    return null;
  };


  /** Helper: for a given layer type (like 'dot' or 'choropleth')
   *  update the controls based on the values in the query string.
   *  The query string can direct the checkbox to be checked or not,
   *  and which layer should be shown (if there are multiples).
   *
   *  @private
   */
  // NOTE: This depends a huge amount on the specific ids given
  // to the DOM objects.  Yeah, I could put in another layer of
  // indirection, but that would make it even more of a chore to
  // get at/address/find the elements I want.
  this.adjustLayerControl = function(layersetName) {
    var checkboxName = '#' + layersetName + 'Checkbox';
    var $checkbox = $(checkboxName);

    if ($checkbox) {
      var qstringShowFieldName = 'show' +
                    Utilities.capitalizeFirstLetter(layersetName);
      var checkedBool = closurePageInitValues[qstringShowFieldName];
      $checkbox.prop('checked', checkedBool);

      var indexName = layersetName + 'Index';
      if (closurePageInitValues[indexName]) {
        var $selector = $('#' + layersetName + 'Selector');
        // values checked for legality earlier
        $selector.prop('selectedIndex', closurePageInitValues[indexName]);
        var layerSpecName = $selector[0].value;
        var layerSpec = this.getLayerSpec(layersetName, layerSpecName);
        var layerSpecDescription = Utilities.descriptionHtml(layerSpec);
        var $descriptor = $('#' + layersetName + 'Description');
        $descriptor[0].innerHTML = layerSpecDescription;
      }
    }
  };

  /** Gets a layerSpec given the names of the layerset and layerSpec.
   *  Done via brute-force by matching strings, ugh.
   *
   *  @param {string} layersetName the name of the layerset which
   *    contains the target layerSpec
   *  @param {string} layerSpec the name of the target layerSpec
   *  @return {object} A layerSpec
   *  @public
   */
  this.getLayerSpec = function(layersetName, layerSpecName) {
    var layersets = this.omai.layersets;
    var layerSpec = null;
    $.each(layersets, function(index, layerset) {
      if (layerset.shortName == layersetName) {
        $.each(layerset.layers, function(index, candidate) {
          if (candidate.shortName = layerSpecName)
            layerSpec = candidate;
        });
      }
    });
    return layerSpec;
  };

  /** Creates and initializes all the DOM elements relating to the
   *  map which depend upon the mapApplicationInfo.
   *
   *  @return {boolean} whether there were errors during processing
   *  @public
   */
  // TODO this is honkin' long, maybe break it up into different
  // pieces?
  this.createAndPopulateElements = function() {

    document.title = this.omai.pageTitle;

    $('#explanation').html('<b>' + this.omai.pageTitle + '</b><p>' +
                             this.omai.pageDescription + '<p>');

    var layersets = this.omai.layersets;
    var valid = true;
    var scope = this;
    $.each(layersets, function(index, layerset) {
      var selector = scope.createLayerSelectorControl(layerset);
      if (selector) {
        $('#layerControls').append(selector);
      }

      scope.adjustLayerControl(layerset.shortName);
    });
    if (!valid) {
      alert('One of the layersets was not valid!  See console log for ' +
            'more details.');
      return null;
    }


    $('#sharingUrl')[0].href = '#';

    // Allow switching between cartogram and not
    var checkedString = closurePageInitValues.cartogram ? 'checked' : '';
    if (this.omai.hasCartogram) {
      var cartogramCheckboxString =
        '<input type="checkbox" id="isCartogramCheckbox" ' + checkedString +'>';
      var cartogramText = 'Show as cartogram<p />';
      $('#cartogramSelector').append(cartogramCheckboxString + cartogramText);
    }

    // Set up the map
    closureMap.setView([closurePageInitValues.lat, closurePageInitValues.lng],
                 closurePageInitValues.zoom);


    if (this.omai.citiesUrl && this.omai.cityIconUrl) {
      var showCitiesCheckbox = document.createElement('input');
      showCitiesCheckbox.id = 'showCitiesCheckbox';
      showCitiesCheckbox.type = 'checkbox';
      showCitiesCheckbox.checked = closurePageInitValues.showCities;

      var showCitiesLabel = document.createElement('label');
      showCitiesLabel.htmlFor = 'showCitiesCheckbox';
      showCitiesLabel.innerHTML = 'Show city names ';
      showCitiesLabel.id = 'showCitiesLabel';
      showCitiesLabel.className = 'indented';

      $('#showCities')[0].appendChild(showCitiesCheckbox);
      $('#showCities')[0].appendChild(showCitiesLabel);
    }


    // Put in the attribution for the page/app (as opposed to the data)
    if (this.omai.attribution) {
      $('#attribution').append(', page customized by ' + this.omai.attribution);
    } else {
      $('#attribution').append('.');
    }

    return true;
  };

  /** Updates the legend.
   *
   *  @param layerSpec {object} A piece of the MAI describing the current layer
   *  @param urlFragment {object} The base of a URL which describes the legend
   *  @public
   */
  $('#legendImage')[0].update = function(layerSpec) {
    if (layerSpec.legendUrl) {
      this.src = layerSpec.legendUrl;
    } else {
      this.src = 'http://maps.webfoot.com/mapeteria2/tiles/clearTile.png';
    }

  };


}
