# This test is designed to test a MAI which is totally messed up: valid
# JSON but not at all the correct thing.  It should fail completely in
# expected ways.

# TODO check for no controls, no cartogram checkbox, no description

import unittest
import time
from MapApplicationPage import MapApplicationPage
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.alert import Alert
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from selenium.common.exceptions import TimeoutException
from selenium.common.exceptions import NoSuchElementException

CHROMEDRIVER_LOCATION = '/appdata/bin/chromedriver'
INCOMPLETE_PAGE_TITLE = 'Incomplete pageTitle'
GOOD_JSON = 'http://localhost/mapzarf/test/testSanity.html'
EMPTY_JSON = 'http://localhost/mapzarf/test/testIncompleteMai1.html'
MINIMAL_JSON = 'http://localhost/mapzarf/test/testIncompleteMai2.html'
ONE_LAYER_JSON = 'http://localhost/mapzarf/test/testIncompleteMai3.html'

class TestIncomplete(unittest.TestCase):

  def setUp(self):
    self.browser = None 

  def markerExists(self):
    try: 
      WebDriverWait(self.browser, 3).until(
        EC.presence_of_element_located((By.CLASS_NAME, 'leaflet-marker-icon')))
    except TimeoutException:
      return False

    return True

  def layerControlExists(self, layerspecName, urlString):
    return self.elementExistsById(layerspecName + "Control", urlString)

  def elementExistsById(self, elementId, urlString):
    self.browser = webdriver.Chrome(CHROMEDRIVER_LOCATION)
    page = MapApplicationPage(self.browser, urlString)
    try: 
      WebDriverWait(self.browser, 3).until(
        EC.presence_of_element_located((By.ID, elementId)))
    except TimeoutException:
      page.tearDown()
      self.browser = None 
      return False

    page.tearDown()
    self.browser = None 
    return True

  def doesMarkerExist(self, urlString):
    # If I don't make a new browser every time, the connection
    # gets refused, maybe due to apache2 anti-DDOS feature?
    self.browser = webdriver.Chrome(CHROMEDRIVER_LOCATION)
    page = MapApplicationPage(self.browser, urlString)
    WebDriverWait(self.browser, 3).until(
        EC.presence_of_element_located((By.ID, 'showCitiesCheckbox')))
    page.showCities(False)

    exists = self.markerExists()
    page.tearDown()
    self.browser = None 
    return exists 

  def testForMarker(self):
    return not self.doesMarkerExist(GOOD_JSON)

  def testForNoMarker(self):
    success = True
    urlStrings = [EMPTY_JSON, MINIMAL_JSON, ONE_LAYER_JSON]
    for urlString in urlStrings:
      success &= not self.doesMarkerExist(urlString)

    return success

#  def checkMultipleForExistence(self, urlStrings, layerspecName, 
#                                elementSuffix, shouldBeThere):
#    elementId = layerspecName + elementSuffix
#
#    success = True
#    for urlString in urlStrings: 
#      once = (shouldBeThere == self.elementExistsById(elementId, urlString))
#      success &= once
#
#    return success

  # Test for layer controls.  Either all should exist or non should exist
  def checkForAllLayerElements(self, urlString, layerspecName, shouldExist):
     success = True

     self.browser = webdriver.Chrome(CHROMEDRIVER_LOCATION)
     page = MapApplicationPage(self.browser, urlString)

     elemId = layerspecName + "Control"

     try: 
       WebDriverWait(self.browser, 3).until(
         EC.presence_of_element_located((By.ID, elemId)))
     except TimeoutException:
       success &= (shouldExist == False)
 
     for widget in ['Checkbox', 'Description']:
       elemId = layerspecName + widget
       try: 
         self.browser.find_element_by_id(elemId)
       except NoSuchElementException as e:
         success &= (shouldExist == False)

     page.tearDown()
     return success

  def checkLayerForMultipleUrls(self, urlStrings, layerspecName, shouldExist):
    success = True
    for urlString in urlStrings:
      s = self.checkForAllLayerElements(urlString, layerspecName, shouldExist)
      success &= (s == shouldExist)

    return success


  def testForNoChoroplethControl(self):
    urlStrings = [EMPTY_JSON, MINIMAL_JSON]
    return self.checkLayerForMultipleUrls(urlStrings, "choroplethLayers", False)

  def testForChoroplethControl(self):
    urlStrings = [GOOD_JSON, ONE_LAYER_JSON]
    return self.checkLayerForMultipleUrls(urlStrings, "choroplethLayers", True)


  def testForDotAndBorderExistence(self):
    urlStrings = [GOOD_JSON]
    success = True
    for layerspecName in ['dotLayers', 'borderLayers']:
      success &= self.checkLayerForMultipleUrls(urlStrings, layerspecName, True)

    return success

  def testForNoDotAndBorderExistence(self):
    urlStrings = [EMPTY_JSON, MINIMAL_JSON, ONE_LAYER_JSON]
    success = True
    for layerspecName in ['dotLayers', 'borderLayers']:
      success &= not self.checkLayerForMultipleUrls(urlStrings, 
                                                    layerspecName, False)

    return success

   


if __name__ == "__main__":
    unittest.main()
