
// Could go into common
function setOpacity(aCheckbox, aLayer, anOpacity) {
  console.log("Setting opacity for layer: ")
  console.log(aLayer)
  if(aCheckbox.checked) {
    aLayer.setOpacity(anOpacity);
  } else {
    aLayer.setOpacity(0.0);
  }
}

// Could go into common
// returns a comma-separated list of values selected
// in the combo box
function getValueString(comboBox) {
  valueString = ""
  valueCount = 0;
  for (i=0;i<comboBox.length;i++) {
    if (comboBox[i].selected)
    {
      // console.log("comboBox value is "+comboBox[i].value);
      valueString = valueString + comboBox[i].value + ",";
    }
  }
  return valueString;
}

function updateDescription(aMapRequest) {
  descriptionP.innerHTML = aMapRequest.description();
}

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

function setPopupInfo() {
  if (this.readyState==4 && this.status==200)
  {
    jurisdictionMarker.setPopupContent(this.responseText);
  }
}

