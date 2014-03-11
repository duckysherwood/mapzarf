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
GOOD_JSON = 'http://localhost/mapzarf/integrationTest/testSanity.html'
EMPTY_JSON = 'http://localhost/mapzarf/integrationTest/testIncompleteMai1.html'
MINIMAL_JSON = 'http://localhost/mapzarf/integrationTest/testIncompleteMai2.html'
ONE_LAYER_JSON = 'http://localhost/mapzarf/integrationTest/testIncompleteMai3.html'
MINIMAL_LAYERSET = 'http://localhost/mapzarf/integrationTest/testIncompleteMai4.html'

class TestIncomplete(unittest.TestCase):

  def setUp(self):
    self.browser = None 

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

    exists = page.doesTeardropMarkerExist()
    page.tearDown()
    self.browser = None 

    return exists 


  # Test for layer controls.  Either all should exist or non should exist
  def checkForAllLayerElements(self, urlString, layerspecNames, shouldExist):
     success = True

     self.browser = webdriver.Chrome(CHROMEDRIVER_LOCATION)
     page = MapApplicationPage(self.browser, urlString)

     # Check for the cities checkbox; when that shows up, the other
     # controls should be ready
     elemId = "showCitiesCheckbox"
     try: 
       WebDriverWait(self.browser, 3).until(
         EC.presence_of_element_located((By.ID, elemId)))
     except TimeoutException:
       print "The showCitiesCheckbox isn't showing up, something is wrong."
       exit()
 
     for layerspecName in layerspecNames:
       for widget in ['Control', 'Checkbox', 'Description']:
         exists = True
         elemId = layerspecName + widget
         try: 
           self.browser.find_element_by_id(elemId)
         except NoSuchElementException as e:
           exists = False

         success &= (shouldExist == exists)
 

     page.tearDown()
     return success

  def checkLayerForMultipleUrls(self, urlStrings, layerspecName, shouldExist):
    success = True
    for urlString in urlStrings:
      s = self.checkForAllLayerElements(urlString, layerspecName, shouldExist)
      success &= s 

    return success


  # Tests -------

  def testForMarker(self):
    success = True
    urlStrings = [GOOD_JSON]
    for urlString in urlStrings:
      success &= self.doesMarkerExist(urlString)

    self.assertTrue(success)

  def testForNoMarker(self):
    success = True
    urlStrings = [EMPTY_JSON, MINIMAL_JSON, ONE_LAYER_JSON, MINIMAL_LAYERSET]
    for urlString in urlStrings:
      s = self.doesMarkerExist(urlString)
      success &= not s

    self.assertTrue(success)

  def testForNoChoroplethControl(self):
    urlStrings = [EMPTY_JSON, MINIMAL_JSON]
    layerspecNames = ["choroplethLayers"]
    success = self.checkLayerForMultipleUrls(urlStrings, layerspecNames, False)
    self.assertTrue(success)

  def testForChoroplethControl(self):
    urlStrings = [GOOD_JSON, ONE_LAYER_JSON]
    layerspecNames = ["choroplethLayers"]
    success = self.checkLayerForMultipleUrls(urlStrings, layerspecNames, True)
    self.assertTrue(success)


  def testForDotAndBorderExistence(self):
    urlStrings = [GOOD_JSON, MINIMAL_LAYERSET]
    success = True
    layerspecNames = ['dotLayers', 'borderLayers']
    success = self.checkLayerForMultipleUrls(urlStrings, layerspecNames, True)
    self.assertTrue(success)


  def testForNoDotAndBorderExistence(self):
    urlStrings = [EMPTY_JSON, MINIMAL_JSON, ONE_LAYER_JSON]
    success = True
    layerspecNames = ['dotLayers', 'borderLayers']
    success = self.checkLayerForMultipleUrls(urlStrings, layerspecNames, False)
    self.assertTrue(success)
   

if __name__ == "__main__":
    unittest.main()
