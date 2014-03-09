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
    time.sleep(3)  # at sleep(2), sometimes the tiles were still stale.

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

  # check starting layers
  def testStartingChoropleth(self): 
    self.assertTrue(self.page.choroplethTileForAttributeExists(
                              'taxRoiNormalized'))
    self.assertTrue("Federal Spending" in self.page.getChoroplethDescription())

  def testStartingBorder(self): 
    self.assertTrue(self.page.borderTileForTypeExists('statePopCartogram'))
    self.assertTrue("State borders" in self.page.getBorderDescription())

  def testStartingDots(self):
    self.assertTrue(self.page.dotTileForAttributeExists('gunDeathCountPopCart'))
    self.assertTrue("un deaths in" in self.page.getDotDescription())

  # check check the second layers
  def testChangeChoropleth(self):
    self.page.changeChoroplethLayerToIndex(1)
    self.assertTrue(self.page.choroplethTileForAttributeExists(
                                                 'populationPovertyPct'))
    self.assertTrue("less than the poverty" in self.page.getChoroplethDescription())

  def testChangeDots(self):
    self.page.changeDotLayerToIndex(1)
    self.assertTrue(self.page.dotTileForAttributeExists('shutdownSignerCart'))
    self.assertTrue("Shutdown signers" in self.page.getDotDescription())

  def testChangeBorder(self):
    self.page.changeBorderLayerToIndex(1)
    self.assertTrue(self.page.borderTileForTypeExists(
                              'countyPopulationCartogram'))
    self.assertTrue("County borders" in self.page.getBorderDescription())

  # check after changing to mercator
  def testMercatorChoropleth(self):
    self.page.showAsCartogram(False)
    self.assertTrue(self.page.choroplethTileForAttributeExists(
                              'taxRoiNormalized'))
    self.assertTrue("Federal Spending" in self.page.getChoroplethDescription())

  def testMercatorDots(self):
    self.page.showAsCartogram(False)
    self.assertTrue(self.page.dotTileForAttributeExists('gunDeathCount'))
    self.assertTrue("un deaths in" in self.page.getDotDescription())

  def testMercatorBorder(self):
    self.page.showAsCartogram(False)
    self.assertTrue(self.page.borderTileForTypeExists('state'))
    self.assertTrue("State borders" in self.page.getBorderDescription())

  def testCityLabelExists(self):
    self.assertTrue(self.page.doesLabelExistForCityNamed('Indianapolis'))

  def testBogusCityLabel(self):
    self.assertFalse(self.page.doesLabelExistForCityNamed('lasjfasf'))


if __name__ == "__main__":
    unittest.main()
