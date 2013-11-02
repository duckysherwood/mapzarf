
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


/* in commonUtilities.js
function updateLegend(aMapRequest) {
  legendImage.src = 
    "../../mapeteria2/makeLegend.php?lbl=y&o=p" +
	"&minValue=" + aMapRequest.minValue +
	"&maxValue=" + aMapRequest.maxValue +
	"&minColour=" + aMapRequest.minColor +
	"&maxColour=" + aMapRequest.maxColor +
	"&mapping=" + aMapRequest.mapping +
	"&pct=" + aMapRequest.isPct;
   console.log(aMapRequest);
}
*/


/* in commonUtilities.js
function AttributeInfo(table, fieldName, year, 
      minValue, maxValue, description, source, sourceUrl) {
  this.table = table;
  this.fieldName = fieldName;
  this.year = year;
  this.minValue = minValue;
  this.maxValue = maxValue;
  this.description = description;
  this.source = source;
  this.sourceUrl = sourceUrl;
}
*/


/* In cartogramSwitching
// 'projectionType' isn't really the right term, but
// I can't figure out what is.  TODO
function getProjectionType() {
  if(isCartogramCheckbox.checked) {
    return "cartogram";
  } else {
    return "standard";
  }  
}
*/

function onMapClick(e) {
  countyMarker = countyMarker.setLatLng([e.latlng.lat, e.latlng.lng]);

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
  countyMarker.setPopupContent("Looking up congressional district information, please wait...");
  requestUrl(url, setPopupInfo);  // request is a verb here

}

function setPopupInfo() {
  if (this.readyState==4 && this.status==200)
  {
    countyMarker.setPopupContent(this.responseText);
  }
}

/* in CityLabeller
function refreshCityLabels() {
  var bounds = map.getBounds();
  console.log(bounds.getNorthEast());
  var upper = bounds.getNorthEast().lat;
  var lower = bounds.getSouthWest().lat;
  var left = bounds.getSouthWest().lng;
  var right = bounds.getNorthEast().lng;
  var isCartogram = document.getElementById("isCartogramCheckbox").checked;

  labeller.requestCityInfo(upper, lower, left, right, isCartogram);
}
*/


  

/* in commonUtilities
function requestUrl(url, callback) {
  var xmlhttp;
  if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp=new XMLHttpRequest();
    }
  else
    {// code for IE6, IE5
    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
  
  xmlhttp.onreadystatechange=callback;
  xmlhttp.open("GET",url,true);

  xmlhttp.send();

}
*/



/* In commonUtilities.js
// Derived from stackoverflow:
// http://stackoverflow.com/questions/122102/most-efficient-way-to-clone-an-object
// Used for e.g. dotMapRequest;
function cloneBagOfProperties(obj){
    if(obj == null || typeof(obj) != 'object')
        return obj;

    var temp = Object.create(null);

    for(var key in obj)
        temp[key] = obj[key];
    return temp;
}

function cloneObject(obj){
    if(obj == null || typeof(obj) != 'object')
        return obj;

    var temp = obj.constructor(); // changed

    for(var key in obj)
        temp[key] = cloneObject(obj[key]);
    return temp;
}
*/
