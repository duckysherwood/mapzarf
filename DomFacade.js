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
