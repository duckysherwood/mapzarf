/** This class serves to isolate particulars of the DOM -- e.g. 
 * what the id of the cartogram checkbox element is -- from
 * the 'business logic' of the application.
 */
function DomFacade() { };

/** Gets the names of all the layerset elements.
 *  @return {object} Array with the names of all the layersets.
 *  @private
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

DomFacade.getSelectorForLayersetName = function(layersetName) {
  var $selector = $('#' + layersetName + 'Selector');
  Utilities.assertTrue($selector.length <= 1, 
       "There are more than one selectors for " + layersetName);
  return $selector[0];
};

DomFacade.getCityCheckbox = function() {
  var $checkbox = $('#showCitiesCheckbox');
  Utilities.assertTrue($checkbox.length == 1, 
                       "The showCitiesCheckbox isn't in the DOM!");
  return $checkbox[0];
};

DomFacade.getCartogramCheckbox = function() {
  var $checkbox = $('#isCartogramCheckbox');
  Utilities.assertTrue($checkbox.length <= 1, 
                       "There are more than 1 cartogram checkboxes!");
  return $checkbox[0];
};

DomFacade.getSelectedLayerNameForLayerset = function(layersetName) {
  return $('option.' + layersetName + 'Option:selected').val();
};

// This is for checkboxes, I think
DomFacade.getLayerNameForLayersetName = function(layersetName) {
   var selector = DomFacade.getSelectorForLayersetName(layersetName);
   if(!selector) {
     return null;
   }
   return selector.value();
};

DomFacade.setLayerSpecDescription = function(layersetName, htmlDescription) {
  var id = '#' + layersetName + 'Description';
  console.log("id " + id + ", desc " + htmlDescription);
  $descriptors = $(id);
  Utilities.assertTrue($descriptors.length == 1, 
                       'The DOM element '+ layersetName + 
                       'Description is missing.');
  $descriptors.html(htmlDescription);
};

DomFacade.setCheckboxForIdTo = function(elementName, newBool) {
  $(elementName).prop('checked', newBool);
};

DomFacade.getCheckboxForLayerset = function(layersetName) {
  $checkbox = $('#' + layersetName + 'Checkbox');
  Utilities.assertTrue($checkbox.length == 1, 
             'The ' + layersetName + 'Checkbox element is not in the DOM!');
  return $checkbox[0];
}

DomFacade.setCheckboxForLayerset = function(layersetName, newBool) {
  DomFacade.setCheckboxForIdTo('#' + layersetName + 'Checkbox', newBool);
};

DomFacade.isCheckboxChecked = function(checkboxId) {
  return $(checkboxId).is(':checked');
};

DomFacade.isCityCheckboxChecked = function() {
  return DomFacade.isCheckboxChecked('#showCitiesCheckbox');
};

DomFacade.setCityCheckbox = function(newBool) {
  DomFacade.setCheckboxForIdTo('#showCitiesCheckbox', newBool);
}

DomFacade.isCartogramCheckboxChecked = function() {
  return DomFacade.isCheckboxChecked('#isCartogramCheckbox');
};


// Provides a little help debugging
DomFacade.doesElementExist = function(elementName) {
  var $layerDiv = $(elementName);
  if (!$layerDiv) {
    console.log('Warning: Missing element ' + elementName);
    return false;
  }
  return true;
};

DomFacade.doesLayerDivExist = function() {
  return DomFacade.doesElementExist('#layerControls');
};

DomFacade.doesLayersetCheckboxExist = function(layersetName) {
  return DomFacade.doesElementExist('#' + layersetName + 'Checkbox');
};

DomFacade.doesCartogramCheckboxExist = function() {
  return DomFacade.doesElementExist('#isCartogramCheckbox');
}

DomFacade.doesCitiesCheckboxExist = function() {
  return DomFacade.doesElementExist('#showCitiesCheckbox');
}

DomFacade.setLayerIndexForLayersetName = function(layersetName, index) {
  var $selector = $('#' + layersetName + 'Selector');
  $selector.prop('selectedIndex', index);
};

DomFacade.setPageExplanation = function(explanation) {
  $('#explanation').html(explanation);
};


DomFacade.appendAttribution = function(attribution) {
    if (attribution) {
      $('#attribution').append(', page customized by ' + attribution);
    } else {
      $('#attribution').append('.');
    }
};

DomFacade.getLegendElement = function () {
  var $legends = $('#legendImage');
  Utilities.assertTrue($legends.length == 1, 
                       'The legendImage DOM element is missing!');
  return $legends[0];
}

// TODO This will have to be modified when more than one visible layer
// has a legend.
DomFacade.updateLegend = function(url) {
  var legend = DomFacade.getLegendElement();
  if(url) {
    legend.src = url;
  } else {
    legend.src = 'http://maps.webfoot.com/mapeteria2/tiles/clearTile.png';
  }
}

DomFacade.getSharingUrlElement = function() {
  var $urls = $('#sharingUrl');
  Utilities.assertTrue($urls.length == 1,
                       'The sharingUrl DOM element is missing!');
  return $urls[0];
};

DomFacade.setSharingUrl = function(url) {
  var sharingUrl = DomFacade.getSharingUrlElement();
  sharingUrl.href = url;
};

DomFacade.getSharingUrl = function() {
  return DomFacade.getSharingUrlElement.href;
};

DomFacade.appendToLayerControls = function(element) {
  $('#layerControls').append(element);
};

DomFacade.appendToCartogramControls = function(element) {
  $cartograms = $('#cartogramSelector');
  Utilities.assertTrue($cartograms.length == 1, 
                       'The is not exactly one cartogram selectors!');
  $cartograms[0].appendChild(element);
};

DomFacade.appendToCityControls = function(element) {
  $cityControls = $('#showCities');
  Utilities.assertTrue($cityControls.length <= 1,
                       'There are more than 1 showCities checkboxes!');
  $cityControls[0].appendChild(element);
};

  /** Figures out if the map should be in cartogram projection or not.
   *  @return {string} Returns a single character 't' or 'f' to
   *    represent whether the map should show the cartogram projection or not.
   *    It is a string and not a boolean because it will be used in
   *    a URL query string.
   *  @private
   */
DomFacade.getFlagForCheckbox = function(checkboxElementName) {
   var element = $(checkboxElementName);
   if (!element) {
     return 'f';
   }
   return $(checkboxElementName).is(':checked') ? 't' : 'f';
};

DomFacade.getFlagForCartogramCheckbox = function() {
  return DomFacade.getFlagForCheckbox('#isCartogramCheckbox');
}

DomFacade.getFlagForCitiesCheckbox = function() {
  return DomFacade.getFlagForCheckbox('#showCitiesCheckbox');
}

DomFacade.getFlagForLayersetCheckbox = function(layersetCheckbox) {
  return DomFacade.getFlagForCheckbox('#' + layersetName + 'Checkbox');
}

