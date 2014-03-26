/** @author Kaitlin Duck Sherwood
 *  @class DomFacade
 *  @classdesc  This class serves to isolate particulars of the DOM -- e.g. 
 *  what the id of the cartogram checkbox element is -- from
 *  the 'business logic' of the application.
 */
function DomFacade() { };

/** Gets the names of all the layerset elements.
 *  @return {object} Array with the names of all the layersets.
 *  @public
 */
DomFacade.getLayersetNames = function() {
  var layersetName = null;
  var layersetNames = [];

  var layersetCheckboxes = $('.layersetCheckbox');
  $.each(layersetCheckboxes, function(index, layersetCheckbox) {
    layersetName = layersetCheckbox.id.replace('Checkbox', '');
    layersetNames.push(layersetName);
  });

  return layersetNames;

};


/** Gets the names of the visible layersets (the one which clicks interact
 *  with.)
 *  @return {object} Array with the names of the visible layersets
 *  @public
 */
DomFacade.getVisibleLayersetNames = function() {
  var layersetName = null;
  var layersetNames = [];

  var layersetCheckboxes = $('.layersetCheckbox');
  $.each(layersetCheckboxes, function(index, layersetCheckbox) {
    if(layersetCheckbox.checked) {
      layersetName = layersetCheckbox.id.replace('Checkbox', '');
      layersetNames.push(layersetName);
    }
  });

  return layersetNames;
}

/** Gets the names of the "top" layer (the one which clicks interact
 *  with.)
 *  @return {object} Array with the names of the top layerset
 *  @public
 */
DomFacade.getTopVisibleLayersetName = function() {
  var layersets = DomFacade.getVisibleLayersetNames();
  return layersets[layersets.length - 1];
}

/** Gets the selector element for a given layerset name.
 *  @param {string] layersetName A layerset name
 *  @return {object} <Select> DOM element for the given layerset name
 *  @public
 */
DomFacade.getSelectorForLayersetName = function(layersetName) {
  var $selector = $('#' + layersetName + 'Selector');
  Utilities.assertTrue($selector.length <= 1, 
       "There are more than one selectors for " + layersetName);
  return $selector[0];
};

/** Gets the name of the currently-select layer for the given 
 *  layerset.  NOTE: this is used only for chosing one layer from
 *  multiples; it is not used if the layerset only has one layer
 *  (when it would need to ask a checkbox).
 *  @return {object} <input> DOM element for the checkbox to show a
 *    given layerset's layer.
 *  @public
 */
DomFacade.getSelectedLayerNameForLayerset = function(layersetName) {
  return $('option.' + layersetName + 'Option:selected').val();
};

/** Gets the checkbox element for the "show cities" checkbox
 *  @return {object} <input> DOM element for the "show cities" checkbox
 *  @public
 */
DomFacade.getCityCheckbox = function() {
  var $checkbox = $('#showCitiesCheckbox');
  Utilities.assertTrue($checkbox.length == 1, 
                       "The showCitiesCheckbox isn't in the DOM!");
  return $checkbox[0];
};

/** Gets the checkbox element for the "show as cartogram" checkbox
 *  @return {object} <input> DOM element for the "show as cartogram" checkbox
 *  @public
 */
DomFacade.getCartogramCheckbox = function() {
  var $checkbox = $('#isCartogramCheckbox');
  Utilities.assertTrue($checkbox.length <= 1, 
                       "There are more than 1 cartogram checkboxes!");
  return $checkbox[0];
};




/** Sets the description <span> of a layerset to the given text.
 *  @param {string} layersetName The name of a layerset
 *  @param {string} htmlDescription HTML code to put into the description
 *  @public
 */
DomFacade.setLayerSpecDescription = function(layersetName, htmlDescription) {
  var id = '#' + layersetName + 'Description';
  console.log("id " + id + ", desc " + htmlDescription);
  $descriptors = $(id);
  Utilities.assertTrue($descriptors.length == 1, 
                       'The DOM element '+ layersetName + 
                       'Description is missing.');
  $descriptors.html(htmlDescription);
};

/** Sets the state of the given checkbox.
 *  @param {string} elementName The id of the checkbox
 *  @param {string} newBool The checked-state which the checkbox will
 *     get set to.
 *  @public
 */
DomFacade.setCheckboxForIdTo = function(elementName, newBool) {
  $(elementName).prop('checked', newBool);
};

/** Sets the state of the show-cities checkbox
 *  @param {string} newBool The checked-state which the checkbox will
 *     get set to.
 *  @public
 */
DomFacade.setCityCheckbox = function(newBool) {
  DomFacade.setCheckboxForIdTo('#showCitiesCheckbox', newBool);
}

/** Sets the state of the show-checkbox associated with a layerset.
 *  @param {string} layersetnName The name of the layerset
 *  @param {string} newBool The checked-state which the checkbox will
 *     get set to.
 *  @public
 */
DomFacade.setCheckboxForLayerset = function(layersetName, newBool) {
  DomFacade.setCheckboxForIdTo('#' + layersetName + 'Checkbox', newBool);
};


/** Gets the state of checkbox associated with the given layerset.
 *  @param {string} layersetName The name of the layerset
 *  @returns {boolean} The checked-state of the checkbox 
 *  @public
 */
DomFacade.getCheckboxForLayerset = function(layersetName) {
  $checkbox = $('#' + layersetName + 'Checkbox');
  var errorMessage = 'The ' + layersetName + 'Checkbox element is not in the DOM!';
  var success = ($checkbox.length == 1);
  Utilities.assertTrue(success, errorMessage);
  return $checkbox[0];
}


/** Returns the state of the checkbox associated with the given id.
 *  @param {string} checkboxId The id of the checkbox
 *  @returns {boolean} The checked-state of the checkbox 
 *  @public
 */
DomFacade.isCheckboxChecked = function(checkboxId) {
  return $(checkboxId).is(':checked');
};

/** Returns the state of the show-cities checkbox.
 *  @returns {boolean} The checked-state of the checkbox 
 *  @public
 */
DomFacade.isCityCheckboxChecked = function() {
  return DomFacade.isCheckboxChecked('#showCitiesCheckbox');
};

/** Returns the state of the show-as-cartogram checkbox.
 *  @returns {boolean} The checked-state of the checkbox 
 *  @public
 */
DomFacade.isCartogramCheckboxChecked = function() {
  return DomFacade.isCheckboxChecked('#isCartogramCheckbox');
};

// TODO document this
DomFacade.isCheckboxForLayersetChecked = function(layersetName) {
  return DomFacade.isCheckboxChecked('#' + layersetName + 'Checkbox');
}




/** Tells if the given element exists AND prints helpful logging to
 *  the console.
 *  @param {string} elementName The name of the element in question
 *  @public
 */
DomFacade.doesElementExist = function(elementName) {
  var $layerDiv = $(elementName);
  if (!$layerDiv) {
    console.log('Warning: Missing element ' + elementName);
    return false;
  }
  return true;
};

/** Tells if the div which holds all the layer controls exists.
 *  @public
 */
DomFacade.doesLayerDivExist = function() {
  return DomFacade.doesElementExist('#layerControls');
};

/** Tells if the checkbox which controls the visibility of 
 *  a given layerset's layers exists or not.
 *  @param {string} layersetName The name of the layerset
 *  @public
 */
DomFacade.doesLayersetCheckboxExist = function(layersetName) {
  return DomFacade.doesElementExist('#' + layersetName + 'Checkbox');
};

/** Tells if the show-as-cartogram checkbox exists.
 *  @public
 */
DomFacade.doesCartogramCheckboxExist = function() {
  return DomFacade.doesElementExist('#isCartogramCheckbox');
}

/** Tells if the show-cities checkbox exists.
 *  @public
 */
DomFacade.doesCitiesCheckboxExist = function() {
  return DomFacade.doesElementExist('#showCitiesCheckbox');
}

/** Sets the dropdown bar for a given layerset to the given index.
 *  @param {string} layersetName The name of the layerset
 *  @param {int} index The index which the dropdown will be set to.
 *  @public
 */
DomFacade.setLayerIndexForLayersetName = function(layersetName, index) {
  var $selector = $('#' + layersetName + 'Selector');
  $selector.prop('selectedIndex', index);
};

/** Sets the explanatory text (usually about a paragraph) for the page.
 *  @param {string} explanation The text which describes the page to 
 *    the user stumbling upon the page for the first time.
 *  @public
 */
DomFacade.setPageExplanation = function(explanation) {
  $('#explanation').html(explanation);
};


/** Tacks on information about the creator of the page (i.e. who
 *  decided which layers to show, perhaps how to lay it out, perhaps 
 *  what design elements to use, etc) to the attribution line.
 *  @param {string} attribution Brief text explaining whose idea this page was.
 *  @public
 */
DomFacade.appendAttribution = function(attribution) {
    if (attribution) {
      $('#attribution').append(', page customized by ' + attribution);
    } else {
      $('#attribution').append('.');
    }
};

/** Gets the image which holds a legend.
 *  @returns {object} Returns <img> objects which holds legends
 *  @public
 */
DomFacade.getLegendElements = function () {
  var $legends = $('#legendImage');
  Utilities.assertTrue($legends.length == 1, 
                       'The legendImage DOM element is missing!');
  // convert from jQuery to DOM objects
  var legends = []  
  for(i=0; i<$legends.length; i++) {
    legends.push($legends[i]); 
  }
  return legends;
}

DomFacade.addLegend = function(url) {
  var legend = document.createElement('img');
  legend.className = 'legendImage'; 
  legend.src = url;
  var legendDiv = $('#legend')[0];
  legendDiv.appendChild(legend);
}

DomFacade.removeAllLegends = function() {
  $('#legend').empty();
}

/** Returns the <span> which holds the sharing URL.
 *  @returns {object} The element which holds the sharing URL.
 *  @public
 */
DomFacade.getSharingUrlElement = function() {
  var $urls = $('#sharingUrl');
  Utilities.assertTrue($urls.length == 1,
                       'The sharingUrl DOM element is missing!');
  return $urls[0];
};

/** Sets the <a> which holds the sharing URL.
 *  @param {object} url The URL which will reproduce the map which is currently 
 *     visible.
 *  @public
 */
DomFacade.setSharingUrl = function(url) {
  var sharingUrlElement = DomFacade.getSharingUrlElement();
  sharingUrlElement.href = url;
};

/** Adds an element to the layer controls area 
 *  @param {object} element The element to add to the layer controls
 *     visible.
 *  @public
 */
DomFacade.appendToLayerControls = function(element) {
  $('#layerControls').append(element);
};

/** Adds an element to the cartogram controls area (e.g. the checkbox
 *  or label).
 *  @param {object} element The element to add to the cartogram controls.
 *     visible.
 *  @public
 */
DomFacade.appendToCartogramControls = function(element) {
  $cartograms = $('#cartogramSelector');
  Utilities.assertTrue($cartograms.length == 1, 
                       'The is not exactly one cartogram selectors!');
  $cartograms[0].appendChild(element);
};

/** Adds an element to the show-cities controls area (e.g. the checkbox
 *  or label).
 *  @param {object} element The element to add to the show-cities controls.
 *     visible.
 *  @public
 */
DomFacade.appendToCityControls = function(element) {
  $cityControls = $('#showCities');
  Utilities.assertTrue($cityControls.length <= 1,
                       'There are more than 1 showCities checkboxes!');
  $cityControls[0].appendChild(element);
};

  /** Gets the state of a checkbox, but as a one-char string instead
   *  of as a boolean.  Used in creating the sharing URL mostly.
   *  @param {object} checkboxElementName The name of the checkbox DOM element.
   *  @return {string} Returns a single character 't' or 'f' to
   *    represent true or false
   *  @private
   */
DomFacade.getFlagForCheckbox = function(checkboxElementName) {
   var element = $(checkboxElementName);
   if (!element) {
     return 'f';
   }
   return $(checkboxElementName).is(':checked') ? 't' : 'f';
};

  /** Gets the state of the cartogram checkbox, but as a one-char string instead
   *  of as a boolean.  Used in creating the sharing URL mostly.
   *  @return {string} Returns a single character 't' or 'f' to
   *    represent true or false
   *  @public
   */
DomFacade.getFlagForCartogramCheckbox = function() {
  return DomFacade.getFlagForCheckbox('#isCartogramCheckbox');
}

  /** Gets the state of the cartogram checkbox, but as a one-char string instead
   *  of as a boolean.  Used in creating the sharing URL mostly.
   *  @return {string} Returns a single character 't' or 'f' to
   *    represent true or false
   *  @public
   */
DomFacade.getFlagForCitiesCheckbox = function() {
  return DomFacade.getFlagForCheckbox('#showCitiesCheckbox');
}

  /** Gets the state of the show-cities checkbox, but as a one-char string 
   *  instead of as a boolean.  Used in creating the sharing URL mostly.
   *  @return {string} Returns a single character 't' or 'f' to
   *    represent true or false
   *  @public
   */
DomFacade.getFlagForLayersetCheckbox = function(layersetName) {
  return DomFacade.getFlagForCheckbox('#' + layersetName + 'Checkbox');
}

