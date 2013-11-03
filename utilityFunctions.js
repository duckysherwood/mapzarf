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
    return "shutdownSigners";
  }
}

function dotAttributeYear() {
  if(isCartogramCheckbox.checked) {
    return 2011;
  } else {
    return 2008;
  }
}


