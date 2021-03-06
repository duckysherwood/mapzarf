// @author Kaitlin Duck Sherwood
// I tried to set the value of a checkbox to null if it was
// multiple, but the value ended up being "on" (<- literally, 'o'+'n').
// So I'm going to set a sentinel value instead.  It needs to be global
// so that BehaviourCreator can see it.
/* @const */ SENTINEL_MULTIPLE = '';

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
 *  @param mapApplicationInfo {object} JSON describing the application,
 *    especially the layers to go on the map
 *  @param pageInitValues {object} Information on how to set the UI controls
 *    on startup
 */
function DomElementAppender(mapApplicationInfo, pageInitValues ) {
  // omai is "ordered MAI"
  /** @private */ this.omai = mapApplicationInfo; // shortened for typing
  /** @private */ var closurePageInitValues = pageInitValues;

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
    DomFacade.doesLayerDivExist();

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
        layerDescriptionLabel.className = 'doubleIndented';

        layerSelectionControl.appendChild(layerDescriptionLabel);

      } else {

        // When I tried making value=null, value was instead ="on".  ???
        layerSelectionCheckbox.value = SENTINEL_MULTIPLE;

        layerDescriptionLabel.innerHTML = 'Show ' + layerset.displayName +
                                          ' layers: ';
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

    if (DomFacade.doesLayersetCheckboxExist(layersetName)) {
      var qstringShowFieldName = 'show' +
                    Utilities.capitalizeFirstLetter(layersetName);
      var checkedBool = closurePageInitValues[qstringShowFieldName];
      DomFacade.setCheckboxForLayerset(layersetName, checkedBool);

      var indexName = layersetName + 'Index';
      if (closurePageInitValues[indexName]) {
        DomFacade.setLayerIndexForLayersetName(layersetName, 
                                       closurePageInitValues[indexName]);
        var layerSpecName = DomFacade.getSelectedLayerNameForLayerset(
                                       layersetName);
        var layerSpec = this.getLayerSpecObject(layersetName, layerSpecName);
        var layerSpecDescription = Utilities.descriptionHtml(layerSpec);
        DomFacade.setLayerSpecDescription(layersetName, layerSpecDescription);
      }
    }
  };

  /** Gets a layerSpec object given the names of the layerset and layerSpec.
   *  Done via brute-force by matching strings, ugh.
   *
   *  @param {string} layersetName the name of the layerset which
   *    contains the target layerSpec
   *  @param {string} layerSpec the name of the target layerSpec
   *  @return {object} A layerSpec
   *  @public
   */
  this.getLayerSpecObject = function(layersetName, layerSpecName) {
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
   *  map app which depend upon the mapApplicationInfo.
   *
   *  @return {boolean} whether there were errors during processing
   *  @public
   */
  // TODO this is honkin' long, maybe break it up into different
  // pieces?
  this.createAndPopulateElements = function(startingDay) {

    document.title = this.omai.pageTitle;

    DomFacade.setPageExplanation('<b>' + this.omai.pageTitle + '</b><p>' +
                             this.omai.pageDescription + '<p>');

    var layersets = this.omai.layersets;
    var valid = true;
    var scope = this;
    $.each(layersets, function(index, layerset) {
      var selector = scope.createLayerSelectorControl(layerset);
      if (selector) {
        DomFacade.appendToLayerControls(selector);
      }

      scope.adjustLayerControl(layerset.shortName);
    });
    if (!valid) {
      alert('One of the layersets was not valid!  See console log for ' +
            'more details.');
      return null;
    }


    DomFacade.setSharingUrl('#');

    // Allow switching between cartogram and not
    // TODO generalize checkbox creation
    var checkedString = closurePageInitValues.cartogram ? 'checked' : '';
    if (this.omai.hasCartogram) {
      this.addCheckboxControl('isCartogram', 
                                   closurePageInitValues.cartogram,
                                  'Show as a population-based <a href="https://en.wikipedia.org/wiki/Cartogram">cartogram</a>',
                                   DomFacade.appendToCartogramControls);
    }


    if (this.omai.citiesUrl && this.omai.cityIconUrl) {
      this.addCheckboxControl('showCities', 
                                   closurePageInitValues.showCities,
                                  'Show city names ', 
                                   DomFacade.appendToCityControls);
    }


    // Put in the attribution for the page/app (as opposed to the data)
    DomFacade.appendAttribution(this.omai.attribution);

    var firstLayer = layersets[0].layers[0];
    if (firstLayer.timeSeries && firstLayer.timeSeries == 'day') {
      this.addButton('previousWeek', '<<', "mapButton", "Previous Week",
                     DomFacade.appendToDayControls);
      this.addButton('previousDay', '<', "mapButton", "Previous Day",
                     DomFacade.appendToDayControls);
      this.addSpan('currentDay', "(Today's Date)", "mapButton",
	           DomFacade.appendToDayControls);
      this.addButton('nextDay', '>', "mapButton", "Next Day",
                     DomFacade.appendToDayControls);
      this.addButton('nextWeek', '>>', "mapButton", "Next Week",
                     DomFacade.appendToDayControls);

      var startingDayString;
      if (startingDay) {
        // to make the input validation work, startingDay ends up as a Date object
        // Need to convert back to a DateString (yyyy-mm-dd format).
        startingDayString = startingDay.toISOString().split('T')[0];
      } else {
        startingDayString = this.omai.endDay;
      }
      DomFacade.setCurrentDayElement(startingDayString);
      updateDayControls(startingDayString, this.omai.startDay, this.omai.endDay, this.omai);
    } 

    // add graph, timeBar, and tooltip text
    if (this.omai.graphUrl) {
      var tooltipText = "Click on the map to change the graph's jurisdiction; click on the graph to change the map's date.";
      this.addTooltip("graph", tooltipText, DomFacade.appendToGraphDiv);

      var altText = "Graph of data over time for selected jurisdiction";

      // TODO put graph size, active area in MAI?
      this.addImage("graph", "./images/defaultGraph.png", null, null, 0, 0, altText,
                    DomFacade.appendToGraphDiv);

      // make the first graph show the county where the marker is
      var lat = this.omai.startingMarkerLat;
      var lng = this.omai.startingMarkerLng;
      var isCartogram = DomFacade.isCartogramCheckboxChecked();
      var polyYear = (isCartogram ?  firstLayer.cartogramPolyYear : firstLayer.mercatorPolyYear);

      var url = DomFacade.getNewGraphUrl(this.omai, firstLayer);
      if (url) {
        var mapParams = 'lat=' + lat + '&lng=' + lng +
                 '&polyYear= ' + polyYear + '&isCartogram=' + isCartogram;
        url += mapParams;
        scope = this;
        Utilities.requestUrlWithScope(url, DomFacade.setGraphUrl, this);
      }

      // What alt-text should I have for a time bar?
      this.addImage("timeBar", "./images/timeBar.png", null, null, "376px", "36px", null,
                    DomFacade.appendToGraphDiv);

    }


    return true;
  };

  /** Adds a span element to parent element
   *
   *  @param basename {string} The base name of the elements (e.g. 'currentDay')
   *  @param labelText {string} Description printed in the span
   *  @param appendFunction  {object} Function for attaching the checkbox
   *    and label to the parent object
   *  @private
   */
  this.addSpan = function(baseName, labelText, cssClassName,
	                  appendFunction) {
      var span = document.createElement('span');
      span.id = baseName + 'Span';
      span.className = cssClassName;
      span.innerHTML = labelText;
  
      appendFunction(span);
  };
  /** Adds a tooltip to parent element
   *
   *  @param basename {string} The base name of the elements (e.g. 'currentDay')
   *  @param tooltipText {string} text of the tooltip
   *  @param appendFunction  {object} Function for attaching the checkbox
   *    and label to the parent object
   *  @private
   */
  this.addTooltip = function(baseName, tooltipText,
	                  appendFunction) {
      var span = document.createElement('span');
      span.id = baseName + 'Tooltip';
      span.className = "tooltiptext";
      span.innerHTML = tooltipText;
  
      appendFunction(span);
  };
  /** Adds a button element to parent element
   *
   *  @param basename {string} The base name of the elements (e.g. 'showCities')
   *  @param labelText {string} Description printed in the button
   *  @param appendFunction  {object} Function for attaching the checkbox
   *    and label to the parent object
   *  @private
   */
  this.addButton = function(baseName, labelText, cssClassName, hoverText,
	                    appendFunction) {
      var button = document.createElement('button');
      button.id = baseName + 'Button';
      button.title = hoverText;
      button.className = cssClassName;
      button.innerHTML = labelText;
  
      appendFunction(button);
  };

  this.addImage = function(id, url, height, width, left, top, altText, appendFunction) {
    var image = document.createElement('img');
    image.setAttribute('src', url);
    if(id) {
      image.id = id;
    }
    if(height) {
      image.setAttribute('height', height);
    }
    if(width) {
      image.setAttribute('width', width);
    }
    if(top) {
      image.style.position = "absolute";
      image.style.top = top;
    }
    if(left) {
      image.style.position = "absolute";
      image.style.left = left;
    }

    appendFunction(image);
  }


  /** Adds a checkbox element and label element to a parent element
   *
   *  @param basename {string} The base name of the elements (e.g. 'showCities')
   *  @param isChecked {boolean} Initial checked state
   *  @param isChecked {object} The base of a URL which describes the legend
   *  @param labelText {string} Description printed next to checkbox
   *  @param appendFunction  {object} Function for attaching the checkbox
   *    and label to the parent object
   *  @private
   */
  this.addCheckboxControl = function(baseName, isChecked, 
                                     labelText, appendFunction) {
      var checkbox = document.createElement('input');
      checkbox.id = baseName + 'Checkbox';
      checkbox.type = 'checkbox';
      checkbox.checked = isChecked;
  
      var label = document.createElement('label');
      label.htmlFor = baseName + 'Checkbox';
      label.innerHTML = labelText;
      label.id = baseName + 'Label';
      label.className = 'indented';
  
      appendFunction(checkbox);
      appendFunction(label);
  };

} 


