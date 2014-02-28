function toBoolean (aString) {
    return (aString == "t");
  }

function descriptionHtml(layerSpec) {
  return '<a href="' + layerSpec.sourceUrl + '">'
         + layerSpec.description + '</a> '
         + '(' + layerSpec.year + ', '
         + layerSpec.source + ')'

}
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

