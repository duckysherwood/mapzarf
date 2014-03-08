import pdb
import unittest
import time
from MapApplicationPage import MapApplicationPage
from selenium import webdriver

CHROMEDRIVER_LOCATION = '/appdata/bin/chromedriver'
TEST_URL = 'http://localhost/mapzarf/test/testSanity.html'
MARKER_TEXT = "asymmetrical skateboard Bushwick bitters"
PAGE_TITLE = "TestSanity pageTitle"


class TestSanity(unittest.TestCase):

  # Is there a way to not do this overhead every time?
  def setUp(self):
    self.browser = webdriver.Chrome(CHROMEDRIVER_LOCATION)
    self.page = MapApplicationPage(self.browser, TEST_URL)
    self.page.checkTitle(PAGE_TITLE)

  def tearDown(self):
    self.page.tearDown()
    

  # Tests ----------------
  def testClickOnMap(self):
    self.page.clickOnDotTile(4,6,4)
    element = self.browser.find_element_by_id('markerText')
    self.assertTrue(MARKER_TEXT in element.text)

  def testClickOnZoomedMap(self):
    # Because the leaflet tiles all have the same class (and no ID),
    # there isn't a way to distinguish between a zoom 5 tile being ready
    # and a zoom 4 tile being ready, alas.  That means we have to use
    # the large and brutal hammer of a hardcoded sleep(1) here.
    self.page.zoomIn()
    time.sleep(1)  

    self.page.clickOnDotTile(7, 11, 5)
    element = self.browser.find_element_by_id('markerText')
    self.assertTrue( MARKER_TEXT in element.text)
 
  # Throws exception on failure
  def uncheckAllCheckboxes(self):
    self.page.uncheckAllCheckboxes()

  # Throws exception on failure
  def checkAllCheckboxes(self):
    self.page.checkAllCheckboxes()

  # Throws exception on failure
  def testUnchecking(self):
    self.page.checkAllCheckboxes()
    self.page.uncheckAllCheckboxes()
    
  # Throws exception on failure
  def testChecking(self):
    self.page.checkAllCheckboxes()

  # Throws exception on failure
  def testChangeChoropleth(self):
    self.page.changeChoroplethLayerToIndex(1)
    self.assertTrue("poverty" in self.page.getChoroplethDescription())

  def testChangeDots(self):
    self.page.changeDotLayerToIndex(1)
    self.assertTrue("Signers2" in self.page.getDotDescription())

  def testChangeBorder(self):
    self.page.changeBorderLayerToIndex(1)
    self.assertTrue("County" in self.page.getBorderDescription())



if __name__ == "__main__":
    unittest.main()
