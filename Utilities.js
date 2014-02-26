
function descriptionHtml(layerSpec) {
  return '<a href="' + layerSpec.sourceUrl + '">'
         + layerSpec.description + '</a> '
         + '(' + layerSpec.year + ', '
         + layerSpec.source + ')'

}

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

  xmlhttp.open("GET",url,true);
  xmlhttp.send();

  xmlhttp.onreadystatechange=callback;
}

