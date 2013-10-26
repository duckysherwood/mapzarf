<?php

set_include_path("/home/ducky/maps/include");
require_once "CongressionalDistrictPopupInformation.php";


// header("Content-type:text/plain");
header("Content-type:text/html"); // make the error messages show better
$lat = $_GET["lat"];
$lat = filter_var($lat, FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
$lng = $_GET["lng"];
$lng = filter_var($lng, FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
$zoom = $_GET["zoom"];
$zoom = filter_var($zoom, FILTER_SANITIZE_NUMBER_INT);
$cartogram = $_GET["cartogram"];
$cartogram = filter_var($cartogram, FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_LOW | FILTER_FLAG_STRIP_HIGH);
$year = 2013;
if($cartogram == "t") {
  $isCartogram = TRUE;
  $polyYear=2011;
} else {
  $isCartogram = FALSE;
  $polyYear=2011;
}


$fieldName = @$_GET["fieldName"];
$fieldName = ArgumentValidator::stripNonAlphaNumerics(filter_var($fieldName, FILTER_SANITIZE_STRING, FILTER_FLAG_NO_ENCODE_QUOTES| FILTER_FLAG_STRIP_LOW| FILTER_FLAG_STRIP_HIGH));
$fieldName = ArgumentValidator::stripNonAlphaNumerics($fieldName);

$cpi = new CongressionalDistrictPopupInformation("congressionalDistrict", $zoom, $lat, $lng, $polyYear, $year, "Jun", $isCartogram);
$cpi->getDotsInfo($fieldName);


?>
