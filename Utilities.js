
/** Convenience method to make a nice HTML string for a layer description.
 *  @param layerSpec {Object} In object form, the description of a layer from 
 *    the mapApplicationInfo file.
 *  @returns {string} A nicely formatted HTML string of the description of
 *    the selected layer.
 *  @public
 */
function descriptionHtml(layerSpec) {
  var validator = new Validator();

  var descriptor = layerSpec.description;
  if(!descriptor || !validator.isLegalText(layerSpec.description)) {
    descriptor = layerSpec.shortDescription;
    if(!descriptor || validator.isLegalText(layerSpec.shortDescription)) {
      descriptor = "unnamed layer";
    }
  }

  if(layerSpec.sourceUrl && validator.isLegalUrl(layerSpec.sourceUrl)) {
    descriptor = '<a href="' + layerSpec.sourceUrl + '">' + descriptor;
  }

  var source = layerSpec.source;
  if(!source || !validator.isLegalText(layerSpec.source)) {
    source = "Unknown source";
  }


  return descriptor + ' (' + layerSpec.year + ', ' + source + ')';
}

/** Convenience method to make an HTTP request with the callback
 *  keeping the current scope, and only 
 *  @param url {Object} The URL to be fetched.
 *  @param callback {Object} The method to be called when the fetch has returned
 *  @param scope {Object} The scope which the callback method should have
 *  @public
 *  SIDE EFFECTS: causes a callback to happen
 */
function requestUrlWithScope(url, callback, scope) {
  var xmlhttp;
  if (window.XMLHttpRequest) {
      // code for IE7+, Firefox, Chrome, Opera, Safari
      xmlhttp=new XMLHttpRequest();
  } else {
    // code for IE6, IE5
    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }

  xmlhttp.open("GET",url,true);
  xmlhttp.send();

  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      callback.call(scope, xmlhttp.responseText);
    }
  }   
}

/** Convenience method to capitalize the first letter of the input
 *  @param aString {string} The URL to be fetched.
 *  @public
 */
// From
// http://stackoverflow.com/questions/1026069/capitalize-the-first-letter-of-string-in-javascript
function capitalizeFirstLetter(aString) {
    return aString.charAt(0).toUpperCase() + aString.slice(1);
}
