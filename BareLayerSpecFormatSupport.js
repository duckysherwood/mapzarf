/** @author Kaitlin Duck Sherwood
 *  @class BareLayerSpecFormatSupport
 *  @classdesc This class is as simple as it gets for tile layers.
 *    It has a URL in it and some metadata, but really there's just the URL.
 *    This class needs no storage, so all the methods are class methods.
 *
 *  @constructor
 *  @this {BareLayerSpecFormatSupport}
 */
function BareLayerSpecFormatSupport() {
}


/** Gives a URL which tells how to fetch a tile.   Note that there
 *  needs to be some extra added on which will be modified by the
 *  mapping framework to give the tile location.
 *  @public
 *  @param {object} layerSpec Information about the layer
 *  @param {string} projection Identifier for the projection type
 *  @return {string} A URL which tells how to fetch a tile
 *  (Used by MapBehaviorInitializer)
 */
BareLayerSpecFormatSupport.getLayerUrl = function(layerSpec, projection) {
    url = layerSpec.url;
    url = url.replace(/%7B/g, '{');
    url = url.replace(/%7D/g, '}');
    return url;
};


/** Renders a verdict on whether or not the layerSpec is valid.
 *  Because this only has the URL, it can't really make any judgements
 *  about whether the URL is semantically correct; this method can only
 *  judge if the URL is syntactically correcxt.
 *  @public
 *  @param {object} layerSpec Information about the layer
 *  @return {boolean} If the layerSpec is valid or not.
 *  (Used by MapBehaviorInitializer)
 */
BareLayerSpecFormatSupport.validate = function(layerSpec) {
  var requiredFieldsTable = {'shortName' : 'word',
                             'tileEngine' : 'word',
                             'tileEngineVersion' : 'float',
                             'url' : 'url'
                            };
  var optionalFieldsTable = {'shortDescription' : 'text',
                             'description' : 'text',
                             'sourceUrl' : 'url',
                             'providerUrl' : 'url',
                             'provider' : 'text',
                             'licenseUrl' : 'url',
                             'license' : 'text',
                             'year' : 'int',
                             'legendUrl' : 'url'
                            };

  if (!layerSpec.tileEngine) {
    console.log('Tile engine not specified for bare layer');
    return false;
  }

  if (layerSpec.tileEngine != 'bare' && layerSpec.tileEngine != 'Bare') {
    console.log('Called bare class but requested ' +
                layerSpec.tileType + ' tile type');
    return false;
  }

  return Validator.validateFields(layerSpec,
                               requiredFieldsTable, optionalFieldsTable);

};



// TODO JsDoc this
BareLayerSpecFormatSupport.getPointInfoUrl = 
  function(layerSpec) {
  
  return layerSpec.pointInfoUrl;
}
