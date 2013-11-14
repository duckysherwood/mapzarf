// These are function used in displaying information in the popup -- either
// information about the dot clicked on or attribute information for the
// jurisdiction clicked on.

function jurisdictionPopupUrl() {
  return "./districtPopupInformation.php";
}

function dotFieldName() {
  if(isCartogramCheckbox.checked) {
    return "shutdownSignerCart";
  } else {
    return "shutdownSigner";
  }
}

function dotAttributeYear() {
  if(isCartogramCheckbox.checked) {
    return 2011;
  } else {
    return 2008;
  }
}

function getAttribution() {
  return   "Maps &copy; Kaitlin Duck Sherwood using " +
           " boundary shapes from the Census Bureau " +
           " with data from US Census Bureau, Freedom Works and US Federal Election Commission";
}

// optional for copyright notice at the bottom
function getDotAttribution() {
  return "";
}

/*
function getDotAttribution() {
  return " shutdown signer information from Freedom Works.";
}
*/
