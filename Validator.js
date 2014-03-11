function Validator() {
}

/** Checks a string to see if it is a legal word.  Only letters, numbers,
 *  underscore, period, and dash are legal.  No whitespaces.
 *  @param candidate {string} a string to be checked
 *  @return {boolean}
 *  @public
 */
Validator.prototype.isLegalWord = function(candidate) {
  if(typeof candidate != 'string') {
    return false;
  }

  var regexp = /[^\w\-\_\.]/;
  return !candidate.match(regexp); 

}

/** Checks a string to see if it is a legal integer.
 *  @param candidate {int} a value to be checked
 *  @return {boolean} whether the candidate is a legal integer or not
 *  @public
 */
Validator.prototype.isLegalInt = function(candidate) {
  if(!typeof candidate == 'number') {
    return false;
  }

  return (Math.floor(candidate) == candidate);
}

/** Checks a value to see if it is a legal float.
 *  @param candidate {float} a string to be checked
 *  @return {boolean} whether the candidate is a legal float or not
 *  @public
 */
Validator.prototype.isLegalFloat = function(candidate) {
  return typeof candidate == 'number';
}

/** Checks a value to see if it is a legal boolean.
 *  @param candidate A value to be checked
 *  @return {boolean} whether the candidate is a legal boolean or not
 *  @public
 */
Validator.prototype.isLegalBoolean = function(candidate) {
  return typeof candidate == 'boolean';
}


/** Checks a string to see if it is a legal HTML color of the form
 *  "rrggbb" in hex.
 *  @param candidate {string} a string to be checked
 *  @return {boolean} Whether the value is legal.
 *  @public
 */
Validator.prototype.isLegalColor = function(candidate) {
  if(typeof candidate != 'string') {
    return false;
  }

  return !!candidate.match(/[\dABCDEFabcdef]{6,6}/)

}

/** Checks a value to see if is legal free text.  The string
 *  is not allowed to contain any characters that might conceivably
 *  be security risks.
 *  @param candidate {string} a string to be checked
 *  @return {boolean} Whether the value is legal.
 *  @public
 */
Validator.prototype.isLegalText = function(candidate) {
  if(!typeof candidate == 'string') {
    return false;
  }
  return !candidate.match(/^[\"\'\!\%\<\>\&\;]/);
}

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
  "^" +
    // protocol identifier
    "(?:(?:https?|ftp)://)" +
    // user:pass authentication
    "(?:\\S+(?::\\S*)?@)?" +
    "(?:" +
      // IP address exclusion
      // private & local networks
      "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
      "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
      "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
      // IP address dotted notation octets
      // excludes loopback network 0.0.0.0
      // excludes reserved space >= 224.0.0.0
      // excludes network & broacast addresses
      // (first & last IP address of each class)
      "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
      "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
      "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
    "|" +
      // host name
      "(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)" +
      // domain name
      "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*" +
      // TLD identifier
      "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
    ")" +
    // port number
    "(?::\\d{2,5})?" +
    // resource path
    "(?:/[^\\s]*)?" +
  "$", "i"
);

/** Checks a value to see if is a legal URL.  
 *  @param candidate {string} a Url to be checked
 *  @return {boolean} Whether the value is legal.
 *  @public
 */
Validator.prototype.isLegalUrl = function(candidate) {
  if(!typeof candidate == 'string') {
    return false;
  }

  // The "!!" is to turn it from a char into a boolean
  return !!candidate.match(re_weburl);
}

/** Checks a value to see if is a legal URL.  
 *  @param fieldType {string} The type which candidate is supposed to be
 *  @param candidate A value to be checked
 *  @return {boolean} Whether the candidate's value is legal.
 *  @public
 */
Validator.prototype.isLegal = function(fieldType, candidate) {

  // TODO There is probably a slick way to do this with introspection.
  switch (fieldType) {

    case 'int':
      return this.isLegalInt(candidate);
      break;  // belt AND suspenders

    case 'float':
      return this.isLegalFloat(candidate);
      break;

    case 'word':
      return this.isLegalWord(candidate);
      break;

    case 'text':
      return this.isLegalText(candidate);
      break;

    case 'url':
      return this.isLegalUrl(candidate);
      break;

    case 'color':
      return this.isLegalColor(candidate);
      break;

    case 'bool':
      return this.isLegalBoolean(candidate);
      break;

    default:
      return false;
  }

}
