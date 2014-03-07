import unittest
import time
from MapApplicationPage import MapApplicationPage
from selenium import webdriver

CHROMEDRIVER_LOCATION = '/appdata/bin/chromedriver'
TEST_URL = 'http://localhost/mapzarf/test/test1.html'
MARKER_TEXT = "asymmetrical skateboard Bushwick bitters"
PAGE_TITLE = "Test1 pageTitle"


class Tester1(unittest.TestCase):

  # Is there a way to not do this overhead every time?
  def setUp(self):
    self.browser = webdriver.Chrome(CHROMEDRIVER_LOCATION)
    self.browser.get(TEST_URL)
    self.page = MapApplicationPage(self.browser, TEST_URL, PAGE_TITLE)

  def testClickOnMap(self):
    time.sleep(2) # TODO FIXME
    self.page.clickOnDotTile(4,6,4)
    element = self.browser.find_element_by_id('markerText')
    return MARKER_TEXT in element.text

  def testClickOnZoomedMap(self):
    self.page.zoomIn()
    time.sleep(2) # TODO FIXME
    self.page.clickOnDotTile(7, 11, 5)
    element = self.browser.find_element_by_id('markerText')
    return MARKER_TEXT in element.text

  def uncheckAllCheckboxes(self):
    self.page.uncheckAllCheckboxes()

  def checkAllCheckboxes(self):
    self.page.checkAllCheckboxes()

  def testUnchecking(self):
    self.page.checkAllCheckboxes()
    self.page.uncheckAllCheckboxes()
    
  def testChecking(self):
    self.page.checkAllCheckboxes()

  def testChangeChoropleth(self):
    self.page.changeChoroplethLayerToIndex(1)
    return "poverty" in self.page.getChoroplethDescription()

  def testChangeDots(self):
    self.page.changeDotLayerToIndex(1)
    return "Signers2" in self.page.getDotDescription()

  def testChangeBorder(self):
    self.page.changeBorderLayerToIndex(1)
    return "county" in self.page.getBorderDescription()

  def tearDown(self):
    self.page.tearDown()
    

#---- End class Tester

if __name__ == "__main__":
    unittest.main()
