# This test is designed to test a MAI which is totally messed up: valid
# JSON but not at all the correct thing.  It should fail completely in
# expected ways.

import unittest
import time
from MapApplicationPage import MapApplicationPage
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.alert import Alert
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from selenium.common.exceptions import UnexpectedAlertPresentException

CHROMEDRIVER_LOCATION = '/appdata/bin/chromedriver'
INCOMPLETE_PAGE_TITLE = 'Incomplete pageTitle'

class TestIncomplete(unittest.TestCase):

  # Is there a way to not do this overhead every time?
  def setUp(self):
    self.browser = webdriver.Chrome(CHROMEDRIVER_LOCATION)
    self.page = None

  # PROBLEM: the city names are markers
  def markerExists(self):
    try: 
      WebDriverWait(self.browser, 3).until(
        EC.presence_of_element_located((By.CLASS_NAME, 'leaflet-marker-icon')))
    except TimeoutException:
      return False

    return True


  def markerExistsAfterClicking(self):
    self.page.clickOnDotTile(4,6,4)
    return self.markerExists()

  def testGoodJson(self):
    success = True
    urlString = 'http://localhost/mapzarf/test/testSanity.html'
    self.page = MapApplicationPage(self.browser, urlString)
    WebDriverWait(self.browser, 3).until(
        EC.presence_of_element_located((By.ID, 'showCitiesCheckbox')))
    self.page.showCities(False)
    # success &= self.page.checkTitle('TestSanity pageTitle')

    # "not not" is because I want a boolean
    success &= self.markerExists()
    return success and not not self.markerExistsAfterClicking()	

  def testEmptyJson(self):
    success = True
    urlString = 'http://localhost/mapzarf/test/testIncompleteMai1.html'
    self.page = MapApplicationPage(self.browser, urlString)
    WebDriverWait(self.browser, 3).until(
        EC.presence_of_element_located((By.TAG_NAME, 'title')))
    # success &= self.page.checkTitle(INCOMPLETE_PAGE_TITLE)

    success &= not self.markerExists()

    # check for no map, no controls, no cartogram checkbox...
    return success and not self.markerExistsAfterClicking()

#  def testMinimalJson(self):
#    urlString = 'http://localhost/mapzarf/test/testIncompleteMai2.html'
#    self.page = MapApplicationPage(self.browser, urlString)
#    self.page.checkTitle(INCOMPLETE_PAGE_TITLE)
#    return not self.getAMarkerElement()	
#
#  def testOneChoropleth(self):
#    urlString = 'http://localhost/mapzarf/test/testIncompleteMai3.html'
#    self.page = MapApplicationPage(self.browser, urlString)
#    self.page.checkTitle(INCOMPLETE_PAGE_TITLE)
#    return not self.getAMarkerElement()	

  def tearDown(self):
    self.page.tearDown()
    

#---- End class Tester

if __name__ == "__main__":
    unittest.main()
