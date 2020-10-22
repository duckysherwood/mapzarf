/** @author Kaitlin Duck Sherwood
 *  @class Runner
 *  @classdesc This class is the entry point for all the other code,
 *    sort of like =main()= in C programs.
 *
 *  @constructor
 *  @param mapApplicationInfo {object} A JSON object with information
 *    about how to set up the map.
 */
function Runner() {
}


/** This is where execution really kicks off.  This is a callback from
 *  the $.get of the MAI file.
 *  @public
 */
Runner.prototype.start = function(data, textStatus, jqXhr) {

  if (textStatus != 'success') {
    this.maiAlert();
  }

  var orderedMai = data;
  if (!Validator.validateOrderedMai(data)) {
    return null;
  }

  var mapDisplayParameters = new MapDisplayParameters(orderedMai);
  var mai = Runner.convertOrderedMaiToUnorderedMai(orderedMai);

  var pageInitValues = mapDisplayParameters.getPageValueParameters();

  var domAppender = new DomElementAppender(orderedMai, pageInitValues);
  // What day should the map start off showing?
  var startingDay = pageInitValues.day;
  if (domAppender.createAndPopulateElements(startingDay)) {

    var mapFacade = MapFacade.makeMapFacade(mai, cityLabeller);
    var minZoom = mai.minZoom || 0;
    var maxZoom = mai.maxZoom || 14;

    Utilities.assertTrue(pageInitValues.lat && 
                         pageInitValues.lng && 
                         pageInitValues.zoom);
    mapFacade.initializeMap(pageInitValues.lat, pageInitValues.lng, 
                            pageInitValues.zoom, minZoom, maxZoom);

    if (mai.startingMarkerLat && mai.startingMarkerLng) {
      mapFacade.initializeMarker(pageInitValues.markerLat, 
                                 pageInitValues.markerLng);
    }

    var cityLabeller;
    if (mai.citiesUrl && mai.cityIconUrl) {
      cityLabeller = new CityLabeller(mapFacade, 
                                      mai.citiesUrl, mai.cityIconUrl);
      cityLabeller.refreshCityLabels(cityLabeller);
    }

    var listenerInitializer =
      new ListenerInitializer(mapFacade, mai, cityLabeller);
    listenerInitializer.initialize();


  }
};

/** Convenience method to put up an alert if the MAI file was wrong.
 *  @private
 */
Runner.prototype.maiAlert = function() {
   alert('There was a problem with the JSON file '
          + 'used to determine the layout and capabilities of this page. '
          + "Either the file doesn't exist, it can't be read, or it has "
          + 'a syntax error in it.\n');
};

/** This function takes an MAI with layerset and layerSpec arrays, (which is
 *  (as it comes from the JSON MapApplicationInfo file) and turns it into
 *  an JSON-esque object the layersets and layerSpecs are objects, i.e.
 *  act more like associative arrays.  The associative arrays are
 *  easier to address and, perhaps more importantly, that's how I wrote
 *  the code at first.  (I retrofitted the arrays so that users could
 *  specify the order which controls and layers were presented.)
 *  @param {object} omai -- MapApplicationInfo object using arrays
 *  @return {object} a MAI which uses associative arrays
 */
// @@@ is this the right place for the converter?  Name too long?
Runner.convertOrderedMaiToUnorderedMai = function(omai) {

  // Note: the omai has already been validated by this point.

  var mai = {};
  $.each(omai, function(key, value) {
    if (key != 'layersets') {
      mai[key] = value;
    }
  });

  // @@@ TODO make sure that layerset names don't collide with the names of
  // omai properties, or that layerSpec names don't collide with the
  // each other
  $.each(omai.layersets, function(index, layerset) {
    layersetName = layerset.shortName;
    mai[layersetName] = {};
    $.each(layerset.layers, function(index, layerSpec) {
      mai[layersetName][layerSpec.shortName] = layerSpec;
      // If we delete, it gets deleted from the mai because
      // stuff is done by reference, not copying.
      // delete mai[layersetName][layerSpec.shortName].shortName;
    });
  });


  return mai;
};
