import unittest
import urllib
import urlparse
import time
from MapApplicationPage import MapApplicationPage
from selenium import webdriver
from selenium.common.exceptions import TimeoutException

CHROMEDRIVER_LOCATION = '/appdata/bin/chromedriver'
TEST_URL = 'http://localhost/mapzarf/test/testSanity.html'
MARKER_TEXT = 'asymmetrical skateboard Bushwick bitters'
PAGE_TITLE = 'TestSanity pageTitle'

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

    page.tearDown()

  def testMoveMap(self):
    queryString = "lat=38.5&lng=-122&zoom=8&cartogram=f"

    url = TEST_URL + "?" + queryString
    print url
    page = MapApplicationPage(self.browser, url)
    page.checkTitle(PAGE_TITLE)
    page.showCities(False)

    # The marker was not moved, so it should still be at defaults
    # (i.e. off screen).
    self.assertFalse(page.doesTeardropMarkerExist())
    
    # I can't check to see what the lat/lng of the center is,
    # but I can look for a tile which would not be visible in the
    # default coordinates.  This will raise an exception if the tile
    # is not visible.
    page.clickOnDotTile(41, 99, 8)

    # Clicking on the tile should make the marker visible.
    self.assertTrue(page.doesTeardropMarkerExist())

    success = False
    try:
      page.clickOnDotTile(4, 6, 4)  # not on the map view
    except TimeoutException:
      success = True
    self.assertTrue(success)  

    page.tearDown()

  # Check a qstring which specifies the marker movement
  def testMoveMap(self):
    queryString = "markerLat=-38.5&markerLng=25"

    url = TEST_URL + "?" + queryString
    print url
    page = MapApplicationPage(self.browser, url)
    page.checkTitle(PAGE_TITLE)
    page.showCities(False)

    # the marker should not be visible at first
    self.assertFalse(page.doesTeardropMarkerExist())

    # clicking on the map should make the marker show up
    page.clickOnDotTile(4, 6, 4)
    self.assertTrue(page.doesTeardropMarkerExist())

    page.tearDown()

  def testCartogramFlag(self):
    queryString = 'cartogram=f'
    tileClassName = 'leaflet-tile'

    url = TEST_URL + '?' + queryString
    print url
    page = MapApplicationPage(self.browser, url)
    page.checkTitle(PAGE_TITLE)
    page.showCities(False)

    self.assertTrue(page.tileLayerOfTypeAndAttributeExists(
                         "choroplethLayers", "polyType=state"))
 
    # Now switch to cartogram, and tile 3,7,4 should be found
    page.showAsCartogram(True)
    self.assertTrue(page.tileLayerOfTypeAndAttributeExists(
                         "choroplethLayers", "polyType=statePopCartogram"))

    page.tearDown()

  # Note: this is not highly portable.  Some fields won't be 
  # given in some cases.  For example, if the MAI doesn't specify
  # any choropleth layers, there won't be a choropleth checkbox,
  # so there won't be any 'showChoropleths' field.
  def queryStringCreationHelper(self, page, field, expectedValue):
    sharingUrl = page.getSharingUrl()
    qs = urlparse.parse_qs(urllib.splitquery(sharingUrl)[1])
    self.assertEqual(qs[field][0], expectedValue)
   

  def testQueryStringCreation(self):
    url = TEST_URL 
    page = MapApplicationPage(self.browser, url)
    page.checkTitle(PAGE_TITLE)

    sharingUrl = page.getSharingUrl()
    print sharingUrl
    qs = urlparse.parse_qs(urllib.splitquery(sharingUrl)[1])
    for field in ['showChoropleths', 'showDots', 'showBorders',
                  'cartogram', 'showCities']:
      if field in qs:
        self.assertTrue(qs[field][0] == 't')

    for field in ['choroplethIndex', 'dotIndex', 'borderIndex']:
      if field in qs:
        self.assertTrue(qs[field][0] == '0')

    self.assertTrue(qs['markerLng'][0] == '-100')
    self.assertTrue(qs['markerLat'][0] == '40')
    self.assertTrue(qs['lat'][0] == '38')
    self.assertTrue(qs['lng'][0] == '-95')
    self.assertTrue(qs['zoom'][0] == '4')

    page.showAsCartogram(False)
    self.queryStringCreationHelper(page, 'cartogram', 'f')

    page.showChoropleths(False)
    self.queryStringCreationHelper(page, 'showChoropleths', 'f')


    page.showDots(False)
    sharingUrl = page.getSharingUrl()
    qs = urlparse.parse_qs(urllib.splitquery(sharingUrl)[1])
    self.assertTrue(qs['showDots'][0] == 'f')

    page.showCities(False)
    self.queryStringCreationHelper(page, 'showCities', 'f')

    page.changeDotLayerToIndex(1)
    self.queryStringCreationHelper(page, 'dotIndex', '1')

    page.changeBorderLayerToIndex(1)
    self.queryStringCreationHelper(page, 'borderIndex', '1')

    page.changeChoroplethLayerToIndex(1)
    self.queryStringCreationHelper(page, 'choroplethIndex', '1')

    page.zoomIn()
    time.sleep(1)  # zoom takes a minute to settle
    self.queryStringCreationHelper(page, 'zoom', '5')

    # TODO not quite sure how to change center or marker location

    page.tearDown()

  # Does it crash or fail gracefully?
  def testEvilQueryString(self):
    queryString = "lat=380&lng=-950&zoom=-3&cartogram=7&showCities=2&markerLat=100&markerLng=squirrelshowChoropleths=maybe&choroplethIndex=-2&showDots=t&dotIndex=17&showBorders=t&borderIndex=32"

    url = TEST_URL + "?" + queryString
    print url
    page = MapApplicationPage(self.browser, url)
    page.checkTitle(PAGE_TITLE)

    time.sleep(2)

    page.tearDown()


if __name__ == '__main__':
    unittest.main()
