/** @author Kaitlin Duck Sherwood
 *  @class LeafletMapFacade
 *  @classdesc This class is a concrete subclass of MapFacade and all the 
 *  @param {object} aMapApplicationInfo The MAI, read from the MAI file.
 *  Leaflet-specific behaviour.
 */
function LeafletMapFacade(aMapApplicationInfo) {
  this.map = null;
  this.mai = aMapApplicationInfo;
  this.cityMarkers = [];
  this.jurisdictionMarker = null;  
};

LeafletMapFacade.prototype = new MapFacade();

/** Initializes the map, e.g. setting it to the starting location.
 *  SIDE EFFECT: initializes the map
 *  @param {float} centerLat The map's starting center latitude
 *  @param {float} centerLng The map's starting center longitude
 *  @param {int} zoom The map's starting zoom
 *  @param {int} minZoom The farthest back the user will be allowed to zoom.
 *  @param {int} maxZoom The closest into the earth the user will be allowed
 *    to zoom
 *  @public
 */
LeafletMapFacade.prototype.initializeMap = function(centerLat, centerLng,
                          startingZoom, minZoom, maxZoom) {
  // L (from Leaflet) is global scope, but we need =map= in this scope
  // so we can pass it to behaviour
  this.map = L.map('map', {minZoom: minZoom, maxZoom: maxZoom});
  this.map.setView([centerLat, centerLng], startingZoom);
  this.updateLayers();
};


/** Removes all city labels from existence.  This is kind of harsh; might
 *  look into caching markers in the future, or only removing markers which
 *  are no longer on the map.
 *  SIDE EFFECT: removes all city labels
 *  @public
 */
LeafletMapFacade.prototype.removeAllCityLabels = function() {
  var scope = this;
  // Per http://stackoverflow.com/questions/9912145/leaflet-how-to-find-existing-markers-and-delete-markers
  $.each(this.cityMarkers, function(index, marker) {
    scope.map.removeLayer(marker);
  });
  scope.cityMarkers = [];
}


/** Helper for adding the map click listener.  
 *  SIDE EFFECT: adds map click listener.
 *  @param {function} callback The function to be called when user clicks on
 *    the map
 *  @public
 */
LeafletMapFacade.prototype.addMapClickListener = function(callback) {
  console.log("Adding map click listener");
  this.map.on('click', callback);
};

/** Helper for adding the map drag end listener.  
 *  SIDE EFFECT: adds map drag end listener.
 *  @param {function} callback The function to be called when user pans the map
 *  @public
 */
LeafletMapFacade.prototype.addMapDragEndListener = function(callback) {
  console.log("Adding map drag end listener");
  this.map.on('dragend', callback);
};

/** Helper for adding the map zoom end listener.  
 *  SIDE EFFECT: adds map zoom end listener.
 *  @param {function} callback The function to be called when user zooms the map
 *  @public
 */
LeafletMapFacade.prototype.addMapZoomEndListener = function(callback) {
  this.map.on('zoomend', callback);
};

/** Helper for getting the center coordinates of the map's current location.
 *  @returns {object} [lat, lng]
 *  @public
 */
LeafletMapFacade.prototype.getCenter = function() {
  return this.map.getCenter();
};


/** Removes a tile layer from the map.
 *  SIDE EFFECT: removes layer
 *  @param {object} A layer (with the exact type determined by which 
 *    slippymap framework is specified in the MAI file).
 *  @public
 */
LeafletMapFacade.prototype.removeLayer = function(layer) {
  this.map.removeLayer(layer);
};

/** Adds a tile layer to the map.
 *  SIDE EFFECT: adds layer
 *  @param {object} A layer (with the exact type determined by which 
 *    slippymap framework is specified in the MAI file).
 *  @public
 */
LeafletMapFacade.prototype.addLayer = function(layer) {
  this.map.addLayer(layer);
};

/** Adds a city name to the map.
 *  SIDE EFFECT: adds the name of a city to the map (as an icon)
 *  @param {float} lat The city's latitude
 *  @param {float} lng The city's longitude
 *  @param {string} cityName The city's name
 *  @param {string} A URL to an icon representing the city (e.g. the city's 
 *    name)
 *  @public
 */
LeafletMapFacade.prototype.addCityLabel = function(lat, lng, cityName, cityNameIconUrl) {
  cityNameIcon = L.icon({iconUrl: cityNameIconUrl, iconAnchor: [2, 10]});
  marker = L.marker([lat, lng], {icon: cityNameIcon,
                             clickable: false, draggable: false});
  this.cityMarkers.push(marker);
  this.map.addLayer(marker);
};


/** Gets the northernmost (top) latitude visible on the map.
 *  @returns {float} The maximum visible latitude
 *  @public
 */
LeafletMapFacade.prototype.getNorthBound = function() {
  return this.map.getBounds().getNorthEast().lat;
};

/** Gets the easternmost (right) longatitude visible on the map.
 *  @returns {float} The maximum visible longitude
 *  @public
 */
LeafletMapFacade.prototype.getEastBound = function() {
  return this.map.getBounds().getNorthEast().lng;
};

/** Gets the westernmost (left) longitude visible on the map.
 *  @returns {float} The minimum visible longitude
 *  @public
 */
LeafletMapFacade.prototype.getWestBound = function() {
  return this.map.getBounds().getSouthWest().lng;
}

/** Gets the southernmost (bottom) latitude visible on the map.
 *  @returns {float} The minimum visible latitude
 *  @public
 */
LeafletMapFacade.prototype.getSouthBound = function() {
  return this.map.getBounds().getSouthWest().lat;
};

/** Gets the map's current zoom level
 *  @returns {int} The map's current zoom level
 *  @public
 */
LeafletMapFacade.prototype.getZoom = function() {
  return this.map.getZoom();
};


// Below here are methods related to the jurisdiction marker. *************

/** Pass through to open the popup on the jurisdiction marker.
 *  SIDE EFFECT: Opens popup.
 *  @public
 */
LeafletMapFacade.prototype.openPopup = function() {
  this.jurisdictionMarker.openPopup();
};

/** Helper for adding the marker click listener.  
 *  SIDE EFFECT: adds click listener.
 *  @param {function} callback The function to be called when User clicks on the
 *    marker.
 *  @public
 */
LeafletMapFacade.prototype.addMarkerClickListener = function(callback) {
  if (this.jurisdictionMarker) {
    this.jurisdictionMarker.on('click', callback);
  }
};

/** Sets the content of the jurisdiction marker.
 *  SIDE EFFECT: sets popup content
 *  @param {string} text The new content of the popup marker
 *  @public
 */
LeafletMapFacade.prototype.setPopupContent = function(text) {
  this.jurisdictionMarker.setPopupContent(text);
};

/** Initializes the jurisdiction marker: sets the initial content, lat, lng.
 *  SIDE EFFECT: Initializes the jurisdiction marker.
 *  @param {float} lat The jurisdiction marker's new latitude
 *  @param {float} lng The jurisdiction marker's new longitude
 *  @public
 */
LeafletMapFacade.prototype.initializeMarker = function(lat, lng) {
    this.jurisdictionMarker = L.marker([lat, lng])
                           .bindPopup('Fetching data, please wait...')
                           .addTo(this.map);
};

/** Sets the jurisdiction marker's position.
 *  SIDE EFFECT: Moves the jurisdiction marker.
 *  @param {float} lat The jurisdiction marker's new latitude
 *  @param {float} lng The jurisdiction marker's new longitude
 *  @public
 */
LeafletMapFacade.prototype.setJurisdictionMarkerLatLng = function(lat, lng) {
  if (this.jurisdictionMarker) {
    this.jurisdictionMarker.setLatLng([lat, lng]);
  }
};

/** Gets the jurisdiction marker's current latitutde.
 *  @returns {float} The jurisdiction marker's current latitude
 *  @public
 */
LeafletMapFacade.prototype.getJurisdictionMarkerLat = function() {
  return this.jurisdictionMarker.getLatLng().lat;
};

/** Gets the jurisdiction marker's current longitude.
 *  @returns {float} The jurisdiction marker's current longitude
 *  @public
 */
LeafletMapFacade.prototype.getJurisdictionMarkerLng = function() {
  return this.jurisdictionMarker.getLatLng().lng;
};

/** Tells if the map has a jurisdiction marker.
 *  @returns {boolean} Whether the map has a jurisdiction marker.
 *  @public
 */
LeafletMapFacade.prototype.hasJurisdictionMarker = function() {
  return !!this.jurisdictionMarker;
};
