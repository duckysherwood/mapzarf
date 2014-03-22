function MapFacade() {};

MapFacade.getCityLabelElements = function() {
  var mapDiv = $('#map')[0];
  var kids = mapDiv.childNodes;
  var klen = kids.length;
  var elements = [] 

  // need to remove labels starting at the back of the list so that
  // the array doesn't get messed up
  // Alternate ways to do this:  make a list
  // of children to delete, mark ones to delete, then delete only those
  if (klen > 2) {
    for (var k = klen - 1; k > 1; k--) {
      try {
      } catch (TypeError) {
        console.log('Type error: ' + kids);
        console.log(kids[k]);
      }

      if (kids[k].nodeName == 'P') {
        elements.push(kids[k]);
      }
    }
  }

  return elements;
}

/** Removes all the city labels from the map.
 *  @private
 *  SIDE EFFECT: removes all the city labels from the map
 */
MapFacade.removeCityLabels = function() {
  var mapDiv = $('#map')[0];
  var labelElements = MapFacade.getCityLabelElements();
  $.each(labelElements, function(index, labelElement) {
    this.mapDiv.removeChild(labelElement);
  });
}
