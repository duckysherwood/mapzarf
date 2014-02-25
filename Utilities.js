
function descriptionHtml(layerSpec) {
  return '<a href="' + layerSpec.sourceUrl + '">'
         + layerSpec.description + '</a> '
         + '(' + layerSpec.year + ', '
         + layerSpec.source + ')'

}
