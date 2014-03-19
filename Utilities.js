function Utilities() {
}

Utilities.assertIsNotNull = function (expression, messsage) {
  if(!expression) {
    alert("Assertion failed! " + message);
  }
}

/** Convenience method to make a nice HTML string for a layer description.
 *  @param layerSpec {Object} In object form, the description of a layer from 
 *    the mapApplicationInfo file.
 *  @returns {string} A nicely formatted HTML string of the description of
 *    the selected layer.
 *  @public
 */
Utilities.descriptionHtml = function(layerSpec) {

  var descriptor = layerSpec.description;
  if(!descriptor || !Validator.isLegalText(layerSpec.description)) {
    descriptor = layerSpec.shortDescription;
    if(!descriptor || Validator.isLegalText(layerSpec.shortDescription)) {
      descriptor = "unnamed layer";
    }
  }

  if(layerSpec.sourceUrl && Validator.isLegalUrl(layerSpec.sourceUrl)) {
    descriptor = '<a href="' + layerSpec.sourceUrl + '">' + descriptor + '</a>';
  }

  var source = layerSpec.source;
  if(!source || !Validator.isLegalText(layerSpec.source)) {
    source = "Unknown source";
  }

  var provider = layerSpec.provider;
  if(provider && layerSpec.providerUrl) {
    provider = '<a href="' + layerSpec.providerUrl + '">' + provider + '</a>';
  }

  if(!provider) {
    provider = "Unknown source";
  }

  var year = layerSpec.year ? layerSpec.year + ", " : "";
  

  descriptor = descriptor + ' (' + year + provider + ')';


  var license = layerSpec.license;
  if(license && layerSpec.licenseUrl) {
    license = 'License: <a href="' + layerSpec.licenseUrl + '">' + license + '</a>';
  }

  if(license) {
    descriptor = descriptor + ' ' + license;
  }
  
  return descriptor;

};

/** Convenience method to make an HTTP request with the callback
 *  keeping the current scope, and only 
 *  @param url {Object} The URL to be fetched.
 *  @param callback {Object} The method to be called when the fetch has returned
 *  @param scope {Object} The scope which the callback method should have
 *  @public
 *  SIDE EFFECTS: causes a callback to happen
 */
Utilities.requestUrlWithScope = function (url, callback, scope) {
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
};

/** Convenience method to capitalize the first letter of the input
 *  @param aString {string} The URL to be fetched.
 *  @public
 */
// From
// http://stackoverflow.com/questions/1026069/capitalize-the-first-letter-of-string-in-javascript
Utilities.capitalizeFirstLetter = function (aString) {
    return aString.charAt(0).toUpperCase() + aString.slice(1);
};
