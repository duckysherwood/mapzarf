import pdb
import unittest
import urllib
import urlparse
import time
from MapApplicationPage import MapApplicationPage
from selenium import webdriver
from selenium.common.exceptions import TimeoutException

CHROMEDRIVER_LOCATION = '/appdata/bin/chromedriver'
TEST_URL = 'http://localhost/mapzarf/integrationTest/testSanity.html'
MARKER_TEXT = 'asymmetrical skateboard Bushwick bitters'
PAGE_TITLE = 'TestSanity pageTitle'


class TestQueryString(unittest.TestCase):

  # Is there a way to not do this overhead every time?
  def setUp(self):
    self.browser = webdriver.Chrome(CHROMEDRIVER_LOCATION)

    

  # Tests ----------------
  def testSelectingChoroplethLayer(self):
    queryString = "noImportaIndex=1"
    url = TEST_URL + "?" + queryString
    page = MapApplicationPage(self.browser, url)
    page.checkTitle(PAGE_TITLE)
    time.sleep(1)
    self.assertTrue("less than the poverty" in page.getDescription('noImporta'))

    page.tearDown()

  def testSelectingChoroplethLayerWithLayerOff(self):
    queryString = "noImportaIndex=1&showNoImportas=f"
    url = TEST_URL + "?" + queryString
    page = MapApplicationPage(self.browser, url)
    page.checkTitle(PAGE_TITLE)
    time.sleep(1)
    self.assertTrue("less than the poverty" in page.getDescription('noImporta'))

    page.tearDown()

  def testSelectingDotLayer(self):
    queryString = "whateverIndex=1"
    url = TEST_URL + "?" + queryString
    page = MapApplicationPage(self.browser, url)
    page.checkTitle(PAGE_TITLE)
    time.sleep(1)
    self.assertTrue("Congressional Representatives" in page.getDescription('whatever'))

    page.tearDown()

  def testSelectingDotLayerWithLayerOff(self):
    queryString = "whateverIndex=1&showWhatever=f"
    url = TEST_URL + "?" + queryString
    page = MapApplicationPage(self.browser, url)
    page.checkTitle(PAGE_TITLE)
    time.sleep(1)
    self.assertTrue("Congressional Representatives" in page.getDescription('whatever'))

    page.tearDown()

  def testSelectingBorderLayer(self):
    queryString = "arbitraryIndex=1"
    url = TEST_URL + "?" + queryString
    page = MapApplicationPage(self.browser, url)
    page.checkTitle(PAGE_TITLE)
    time.sleep(2)
    self.assertTrue("County borders" in page.getDescription('arbitrary'))

    page.tearDown()

  def testSelectingBorderLayerWithLayerOff(self):
    queryString = "arbitraryIndex=1&showArbitrary=f"
    url = TEST_URL + "?" + queryString
    page = MapApplicationPage(self.browser, url)
    page.checkTitle(PAGE_TITLE)
    time.sleep(2)
    self.assertTrue("County borders" in page.getDescription('arbitrary'))

    page.tearDown()


  def testTurningAllLayersOffAndIndex1(self):
    queryString = "lat=38.5&lng=-122&zoom=8&markerLat=37.5&markerLng=-121.5&cartogram=f&showWhatever=f&showNoImporta=f&showArbitrary=f&whateverIndex=1&arbitraryIndex=1&noImportaIndex=1&showCities=f"

    url = TEST_URL + "?" + queryString
    page = MapApplicationPage(self.browser, url)
    page.checkTitle(PAGE_TITLE)
    time.sleep(1)
    
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
    self.assertTrue("Congressional Representatives" in page.getDescription('whatever'))
    self.assertTrue("less than the poverty" in page.getDescription('noImporta'))
    self.assertTrue("County borders" in page.getDescription('arbitrary'))

    page.tearDown()

  def testMoveMap(self):
    queryString = "lat=38.5&lng=-122&zoom=8&cartogram=f"

    url = TEST_URL + "?" + queryString
    page = MapApplicationPage(self.browser, url)
    page.checkTitle(PAGE_TITLE)
    page.showCities(False)
    time.sleep(1)

    # The marker was not moved, so it should still be at defaults
    # (i.e. off screen).
    self.assertFalse(page.doesTeardropMarkerExist())
    
    # I can't check to see what the lat/lng of the center is,
    # but I can look for a tile which would not be visible in the
    # default coordinates.  This will raise an exception if the tile
    # is not visible.
    page.clickOnDotTile(40, 98, 8)

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
    page = MapApplicationPage(self.browser, url)
    page.checkTitle(PAGE_TITLE)
    time.sleep(1)
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
    page = MapApplicationPage(self.browser, url)
    page.checkTitle(PAGE_TITLE)
    time.sleep(1)
    page.showCities(False)

    self.assertTrue(page.tileLayerOfTypeAndAttributeExists(
                         "choropleth", "polyType=state&"))
 
    # Now switch to cartogram, cartogram polytype should be found
    page.showAsCartogram(True)
    time.sleep(1)
    self.assertTrue(page.tileLayerOfTypeAndAttributeExists(
                         "choropleth", "polyType=statePopCartogram&"))

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
    time.sleep(1)

    sharingUrl = page.getSharingUrl()
    qs = urlparse.parse_qs(urllib.splitquery(sharingUrl)[1])
    for field in ['showNoImporta', 'showWhatever', 'showArbitrary',
                  'cartogram', 'showCities']:
      if field in qs:
        self.assertTrue(qs[field][0] == 't')

    for field in ['noImportaIndex', 'whateverIndex', 'arbitraryIndex']:
      if field in qs:
        self.assertTrue(qs[field][0] == '0')

    self.assertTrue(qs['markerLng'][0] == '-100')
    self.assertTrue(qs['markerLat'][0] == '40')
    self.assertTrue(qs['lat'][0] == '38')
    self.assertTrue(qs['lng'][0] == '-95')
    self.assertTrue(qs['zoom'][0] == '4')

    page.showAsCartogram(False)
    time.sleep(1)
    self.queryStringCreationHelper(page, 'cartogram', 'f')

    page.showLayerset('noImporta', False)
    self.queryStringCreationHelper(page, 'showNoImporta', 'f')


    page.showLayerset('whatever', False) 
    sharingUrl = page.getSharingUrl()
    qs = urlparse.parse_qs(urllib.splitquery(sharingUrl)[1])
    self.assertTrue(qs['showWhatever'][0] == 'f')

    page.showCities(False)
    time.sleep(1)
    self.queryStringCreationHelper(page, 'showCities', 'f')

    page.changeLayerToIndex('whatever', 1)
    self.queryStringCreationHelper(page, 'whateverIndex', '1')

    page.changeLayerToIndex('arbitrary', 1)
    self.queryStringCreationHelper(page, 'arbitraryIndex', '1')

    page.changeLayerToIndex('noImporta', 1)
    self.queryStringCreationHelper(page, 'noImportaIndex', '1')

    page.zoomIn()
    time.sleep(1)  # zoom takes a minute to settle
    self.queryStringCreationHelper(page, 'zoom', '5')

    # TODO not quite sure how to change center or marker location

    page.tearDown()

  # Does it crash or fail gracefully?
  def testEvilQueryString(self):
    queryString = "lat=380&lng=-950&zoom=-3&cartogram=7&showCities=2&markerLat=100&markerLng=squirrelshowNoImporta=maybe&noImportaIndex=-2&showWhatever=t&whateverIndex=17&showArbitrary=t&arbitraryIndex=32"

    url = TEST_URL + "?" + queryString
    page = MapApplicationPage(self.browser, url)
    page.checkTitle(PAGE_TITLE)

    time.sleep(2)

    page.tearDown()


if __name__ == '__main__':
    unittest.main()
