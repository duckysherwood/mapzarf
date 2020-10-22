/** @author Kaitlin Duck Sherwood
 *  @class Validator
 *  @classdesc This class is used to check (at a relatively simple level)
 *    the correctness of the MAI file.  It will not catch a few truly evil
 *    things, but as this comes from the server and executes on the client,
 *    it shouldn't really be vulnerable to exploits.  I mean, really, if
 *    you want to screw someone, you can just put something nasty on the
 *    server, no need to get clever and put it here.
 *  @public
 */
function Validator() {
}

/** Checks a string to see if it is a legal word.  Only letters, numbers,
 *  underscore, period, and dash are legal.  No whitespaces.
 *  @param candidate {string} a string to be checked
 *  @return {boolean}
 *  @public
 */
Validator.isLegalWord = function(candidate) {
  if (typeof candidate != 'string') {
    return false;
  }

  var regexp = /[^\w\-\_\.]/;
  return !candidate.match(regexp);

};

/** Checks a string to see if it is a legal integer.
 *  @param candidate {int} a value to be checked
 *  @return {boolean} whether the candidate is a legal integer or not
 *  @public
 */
Validator.isLegalInt = function(candidate) {
  if (typeof candidate != 'number') {
    return false;
  }

  return (Math.floor(candidate) == candidate);
};

/** Checks a value to see if it is a legal float.
 *  @param candidate {float} a string to be checked
 *  @return {boolean} whether the candidate is a legal float or not
 *  @public
 */
Validator.isLegalFloat = function(candidate) {
  return typeof candidate == 'number';
};

/** Checks a string to see if it is a legal date string.
 *  @param candidate {string} a value to be checked
 *  @return {boolean} whether the candidate is a legal date string or not
 *  @public
 */
Validator.isLegalDateString = function(candidate) {
  if (typeof candidate != 'string') {
    console.log(candidate + ' is not a date!');
    return false;
  }
  if (candidate.length != 10) {
    console.log(candidate + ' is not a date!');
    return false;
  }
  var pieces = candidate.split('-');
  if (pieces.length != 3) {
    console.log(candidate + ' is not a date!');
    return false;
  }

  try {
  var date = new Date(candidate);
  }
  catch {
    console.log(candidate + ' is not a date!');
    return false;
  }

  return true;

};

/** Checks a value to see if it is a legal boolean.
 *  @param candidate A value to be checked
 *  @return {boolean} whether the candidate is a legal boolean or not
 *  @public
 */
Validator.isLegalBoolean = function(candidate) {
  return typeof candidate == 'boolean';
};


/** Checks a string to see if it is a legal HTML color of the form
 *  "rrggbb" in hex.
 *  @param candidate {string} a string to be checked
 *  @return {boolean} Whether the value is legal.
 *  @public
 */
Validator.isLegalColor = function(candidate) {
  if (typeof candidate != 'string') {
    return false;
  }

  return !!candidate.match(/[\dABCDEFabcdef]{6,6}/);

};

/** Checks a value to see if is legal free text.  The string
 *  is not allowed to contain any characters that might conceivably
 *  be security risks.
 *  @param candidate {string} a string to be checked
 *  @return {boolean} Whether the value is legal.
 *  @public
 */
Validator.isLegalText = function(candidate) {
  if (typeof candidate != 'string') {
    return false;
  }
  return !candidate.match(/[\"\!<>]/);
};

//
// Regular Expression for URL validation
//
// Author: Diego Perini
// Updated: 2010/12/05
// License: MIT
//
// Copyright (c) 2010-2013 Diego Perini (http://www.iport.it)
//
// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation
// files (the "Software"), to deal in the Software without
// restriction, including without limitation the rights to use,
// copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following
// conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
// OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
// WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
// OTHER DEALINGS IN THE SOFTWARE.
//
// the regular expression composed & commented
// could be easily tweaked for RFC compliance,
// it was expressly modified to fit & satisfy
// these test for an URL shortener:
//
//   http://mathiasbynens.be/demo/url-regex
//
// Notes on possible differences from a standard/generic validation:
//
// - utf-8 char class take in consideration the full Unicode range
// - TLDs have been made mandatory so single names like "localhost" fails
// - protocols have been restricted to ftp, http and https only as requested
//
// Changes:
//
// - IP address dotted notation validation, range: 1.0.0.0 - 223.255.255.255
//   first and last IP address of each class is considered invalid
//   (since they are broadcast/network addresses)
//
// - Added exclusion of private, reserved and/or local networks ranges
//
// Compressed one-line versions:
//
// Javascript version
//
// /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i
//
// PHP version
//
// _^(?:(?:https?|ftp)://)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\x{00a1}-\x{ffff}0-9]+-?)*[a-z\x{00a1}-\x{ffff}0-9]+)(?:\.(?:[a-z\x{00a1}-\x{ffff}0-9]+-?)*[a-z\x{00a1}-\x{ffff}0-9]+)*(?:\.(?:[a-z\x{00a1}-\x{ffff}]{2,})))(?::\d{2,5})?(?:/[^\s]*)?$_iuS
//
var re_weburl = new RegExp(
  '^' +
    // protocol identifier
    // "(?:(?:https?|ftp)://)" +  // @@@ kds added file
    '(?:(?:https?|ftp|file)://)' +
    // user:pass authentication
    '(?:\\w+(?::\\S*)?@)?' +
    // "(?:\\S+(?::\\S*)?@)?" +
    '(?:' +
      // IP address exclusion
      // private & local networks
      '(?!(?:10|127)(?:\\.\\d{1,3}){3})' +
      '(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})' +
      '(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})' +
      // IP address dotted notation octets
      // excludes loopback network 0.0.0.0
      // excludes reserved space >= 224.0.0.0
      // excludes network & broacast addresses
      // (first & last IP address of each class)
      '(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])' +
      '(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}' +
      '(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))' +
    '|' +
      // kds I want to be able to use local URLs
      '([\\w\\-\\.]{2,})*' +
      // kds // host name
      // kds "(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)" +
      // kds // domain name
      // kds "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*" +
      // kds // TLD identifier
      // kds "(\\.(?:[a-zA-Z]{2,}))" +
      // kds // "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" + // kds changed
    ')' +
    // port number
    '(?::\\d{2,5})?' +
    // resource path
    '(/[%#=\\w\/\\+\\-\\?\\&\\.]*)?' +
    // "(?:/[^\\s]*)?" +   // kds modified -- not strict enough
  '$', 'i'
);


/** Checks a value to see if is a legal URL.
 *  @param candidate {string} a Url to be checked
 *  @return {boolean} Whether the value is legal.
 *  @public
 */
Validator.isLegalUrl = function(candidate) {
  if (typeof candidate != 'string') {
    return false;
  }

  var relativePathPattern = '^((\\.{1,2}/)*([%#=\\w\/\\+\\-\\?\\&\\.]+))+$';

   // The "!!" is to turn it from a char into a boolean
   // return !!(candidate.match(re_weburl))
   return !!(candidate.match(re_weburl) || (candidate.match(relativePathPattern)));
};

Validator.isLegalArray = function(candidate) {
  return $.isArray(candidate);
};

/** Checks a value to see if is a legal URL.
 *  @param fieldType {string} The type which candidate is supposed to be
 *  @param candidate A value to be checked
 *  @return {boolean} Whether the candidate's value is legal.
 *  @public
 */
Validator.isLegal = function(fieldType, candidate) {

  // TODO There is probably a slick way to do this with introspection.
  switch (fieldType) {

    case 'int':
      return this.isLegalInt(candidate);

    case 'float':
      return this.isLegalFloat(candidate);

    case 'word':
      return this.isLegalWord(candidate);

    case 'text':
      return this.isLegalText(candidate);

    case 'date':
      return this.isLegalDateString(candidate);

    case 'zoom':
      return (this.isLegalInt(candidate) && 
              candidate >= 0 && 
              candidate <= 20);

    case 'url':
      return this.isLegalUrl(candidate);

    case 'color':
      return this.isLegalColor(candidate);

    case 'bool':
      return this.isLegalBoolean(candidate);

    case 'lat':
      return this.isLegalLat(candidate);

    case 'lng':
      return this.isLegalLng(candidate);

    case 'array':
      return this.isLegalArray(candidate);

    case 'frameworkInfo':
      // The concrete instance of MapFacade also needs to validate
      return (candidate.name && this.isLegalWord(candidate.name));

    default:
      return false;
  }

};

Validator.isLegalLat = function(candidate) {
  if (!this.isLegalFloat(candidate)) {
    return false;
  }

  return (candidate > -90) && (candidate < 90);

};

Validator.isLegalLng = function(candidate) {
  if (!this.isLegalFloat(candidate)) {
    return false;
  }

  return (candidate > -180) && (candidate < 180);

};

/** Checks a MapApplicationInfo object for validity.
 *  @param mai {string} The MapApplicationInfo object to be checked.
 *  @return {boolean} Whether the mai is legal
 *  @public
 */
Validator.validateOrderedMai = function(omai) {
  var requiredFields = { 'pageTitle' : 'text',
                         'pageDescription' : 'text',
                         'layersets' : 'array'
                       };
  var optionalFields = { 'pointInfoUrl' : 'url',
                         'startingMarkerLat' : 'lat',
                         'startingMarkerLng' : 'lng',
                         'startingCenterLat' : 'lat',
                         'startingCenterLng' : 'lng',
                         'startingCenterZoom' : 'zoom',
                         'minZoom' : 'zoom',
                         'maxZoom' : 'zoom',
                         'hasCartogram' : 'bool',
                         'citiesUrl' : 'url',
                         'cityIconUrl' : 'url',
                         'graphUrl' : 'url',
                         "xSpanMinDate": 'date',
                         "xSpanMaxDate": 'date',
                         "xSpanMinPixel": 'int',
                         "xSpanMaxPixel": 'int',
                         "xMinDateBound": 'date',
                         "xMaxDateBound": 'date',
                         "yMinPixel": 'int',
                         "yMaxPixel": 'int',
                         "startDay": 'date',
                         "endDay": 'date',
                         'slippyMapFramework' : 'frameworkInfo',
                         'attribution' : 'text' };

  if (!this.validateFields(omai, requiredFields, optionalFields)) {
    alert('The map application info file is invalid, alas.');
    return false;
  }

  var success = true;
  $.each(omai.layersets, function(index, layerset) {
     if (!Validator.validateLayerset(layerset)) {
       success = false;
       return false;
     }
  });

  return success;

};

Validator.validateLayerSpec = function(layerSpec) {
  if (!layerSpec.tileEngine) {
    alert('Missing tile engine for layer Spec ' + layerSpec.name);
  }
  return Validator.classForTileType(layerSpec.tileEngine).validate(layerSpec);
};

Validator.validateLayerset = function(layerset) {
  var requiredFields = { 'shortName' : 'word',
                         'layers' : 'array'};
  var optionalFields = { 'displayName' : 'text'};
  if (!Validator.validateFields(layerset, requiredFields, optionalFields)) {
    alert('The layerset ' + layerset.shortName + ' is invalid');
    return false;
  }

  var success = true;
  $.each(layerset.layers, function(index, layerSpec) {
    if (!Validator.validateLayerSpec(layerSpec)) {
      success = false;
      return false;
    }
  });

  return success;

};

/** Checks a bunch of fields in a candidate object to see if they
 *  are present if they need to be, also if the format is correct.
 *  Candidate is usually a MapApplicationInfo object or a piece
 *  of it.
 *  @param candidate {object} Object to be examined
 *  @param requiredFields {object} Table with keys of the fieldName and
 *         values of a string saying what type of field it is
 *  @param optionalFields {object} Table with keys of the fieldName and
 *         values of a string saying what type of field it is
 *  @return {boolean} Whether the candidate is legal
 *  @public
 */
Validator.validateFields = function(candidate, 
                              requiredFieldsTable, optionalFieldsTable) {

  var success = true;
  $.each(requiredFieldsTable, function(fieldName, fieldType) {
    if (!candidate.hasOwnProperty(fieldName)) {
      console.log('Object is missing field ' + fieldName);
      success = false;
      return false;
    }
    if (!Validator.isLegal(fieldType, candidate[fieldName])) {
      console.log(fieldName + ' of ' + candidate[fieldName] + ' is invalid');
      success = false;
      return false;
    }
  });

  $.each(optionalFieldsTable, function(fieldName, fieldType) {
    if (candidate[fieldName]) {   // field does not need to exist
      if (!Validator.isLegal(fieldType, candidate[fieldName])) {
        console.log(fieldName + ' of ' + candidate[fieldName] + ' is invalid');
        success = false;
        return false;
      }
    }
  });

  return success;

};

Validator.classForTileType = function(tileType) {
  var myClassTable = {
    'mapeteriaChoropleth' : MapeteriaChoroplethLayerSpecFormatSupport,
    'mapeteriaBorder' : MapeteriaBorderLayerSpecFormatSupport,
    'mapeteriaDot' : MapeteriaDotLayerSpecFormatSupport,
    'bare' : BareLayerSpecFormatSupport
    };

  return myClassTable[tileType];
};
