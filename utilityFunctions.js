
function onMapClick(e) {
  jurisdictionMarker = jurisdictionMarker.setLatLng([e.latlng.lat, e.latlng.lng]);

  // popup
    // .setLatLng(e.latlng)
    // .openOn(map);

  var isCartogramCheckbox = document.getElementById("isCartogramCheckbox");
  var fieldName;
  var cartogramFlag;
  if(isCartogramCheckbox.checked) {
    // fieldName = "city";
    // year = 2010;
    fieldName = "shutdownSignersHouseCartogram";
    year = 2011;
    cartogramFlag = "t";
  } else {
    fieldName = "shutdownSigners";
    cartogramFlag = "f";
    year = 2008;
  }

  var url = "./districtPopupInformation.php?" +
     "lat="+e.latlng.lat+"&lng="+e.latlng.lng+"&zoom="+map.getZoom()+"&fieldName="+fieldName + "&polyYear=2011&year=2011&cartogram="+cartogramFlag;
  // popup.setContent("<a href=\""+url+"\">"+url+"</a>");
  jurisdictionMarker.setPopupContent("Looking up congressional district information, please wait...");
  requestUrl(url, setPopupInfo);  // request is a verb here

}

function cityLabelsShouldChange() {
  updateUrls();
  labeller.refreshCityLabels();
}

