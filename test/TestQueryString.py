import pdb
import unittest
import time
from MapApplicationPage import MapApplicationPage
from selenium import webdriver

CHROMEDRIVER_LOCATION = '/appdata/bin/chromedriver'
TEST_URL = 'http://localhost/mapzarf/test/testSanity.html'
MARKER_TEXT = "asymmetrical skateboard Bushwick bitters"
PAGE_TITLE = "TestSanity pageTitle"

# TODO test proper creation of the query string

class TestQueryString(unittest.TestCase):

  # Is there a way to not do this overhead every time?
  def setUp(self):
    self.browser = webdriver.Chrome(CHROMEDRIVER_LOCATION)

    

  # Tests ----------------
  def testSelectingChoroplethLayer(self):
    queryString = "choroplethIndex=1"
    url = TEST_URL + "?" + queryString
    print url
    page = MapApplicationPage(self.browser, url)
    page.checkTitle(PAGE_TITLE)
    self.assertTrue("less than the poverty" in page.getChoroplethDescription())

    page.tearDown()

  def testSelectingChoroplethLayerWithLayerOff(self):
    queryString = "choroplethIndex=1&showChoropleths=f"
    url = TEST_URL + "?" + queryString
    print url
    page = MapApplicationPage(self.browser, url)
    page.checkTitle(PAGE_TITLE)
    self.assertTrue("less than the poverty" in page.getChoroplethDescription())

    page.tearDown()

  def testSelectingDotLayer(self):
    queryString = "dotIndex=1"
    url = TEST_URL + "?" + queryString
    print url
    page = MapApplicationPage(self.browser, url)
    page.checkTitle(PAGE_TITLE)
    self.assertTrue("Congressional Representatives" in page.getDotDescription())

    page.tearDown()

  def testSelectingDotLayerWithLayerOff(self):
    queryString = "dotIndex=1&showDots=f"
    url = TEST_URL + "?" + queryString
    print url
    page = MapApplicationPage(self.browser, url)
    page.checkTitle(PAGE_TITLE)
    self.assertTrue("Congressional Representatives" in page.getDotDescription())

    page.tearDown()

  def testSelectingBorderLayer(self):
    queryString = "borderIndex=1"
    url = TEST_URL + "?" + queryString
    print url
    page = MapApplicationPage(self.browser, url)
    page.checkTitle(PAGE_TITLE)
    self.assertTrue("County borders" in page.getBorderDescription())

    page.tearDown()

  def testSelectingBorderLayerWithLayerOff(self):
    queryString = "borderIndex=1&showBorders=f"
    url = TEST_URL + "?" + queryString
    print url
    page = MapApplicationPage(self.browser, url)
    page.checkTitle(PAGE_TITLE)
    self.assertTrue("County borders" in page.getBorderDescription())

    page.tearDown()


  def xtestTurningAllLayersOffAndIndex1(self):
    queryString = "lat=38.5&lng=-122&zoom=8&markerLat=37.5&markerLng=-121.5&cartogram=f&showDots=f&showChoropleths=f&showBorders=f&dotIndex=1&borderIndex=1&choroplethIndex=1&showCities=f"

    url = TEST_URL + "?" + queryString
    print url
    page = MapApplicationPage(self.browser, url)
    page.checkTitle(PAGE_TITLE)
    
    # None of the possible choropleth layers should be showing
    self.assertFalse(page.choroplethTileForAttributeExists(
                               'taxRoiNormalized'))
    self.assertFalse(page.choroplethTileForAttributeExists(
                               'populationPovertyPct'))

    # None of the possible dot layers should be showing
    self.assertFalse(page.dotTileForAttributeExists(
                               'gunDeathCountPopCart'))
    self.assertFalse(page.dotTileForAttributeExists('gunDeathCount'))
    self.assertFalse(page.dotTileForAttributeExists('shutdownSignerCart'))
    self.assertFalse(page.dotTileForAttributeExists('shutdownSigner'))

    # None of the possible border layers should be showing
    self.assertFalse(page.borderTileForTypeExists('statePopCartogram'))
    self.assertFalse(page.borderTileForTypeExists('state'))
    self.assertFalse(page.borderTileForTypeExists(
                              'countyPopulationCartogram'))
    self.assertFalse(page.borderTileForTypeExists('county'))

    # The descriptions, however, should show that the non-default has
    # been selected
    self.assertTrue("Shutdown signers" in page.getDotDescription())
    self.assertTrue("less than the poverty" in page.getChoroplethDescription())
    self.assertTrue("County borders" in page.getBorderDescription())

    # TODO check map center, zoom
    # can't do that particularly easily, but *can* look for a tile
    # which wouldn't be onscreen in the default case

    # TODO check marker lat, lng
    # can't do this except by looking for the marker being on screen
    # when it would be offscreen in default

    page.tearDown()

# TBD: check a qstring which has all the same values as the defaults


if __name__ == "__main__":
    unittest.main()
