import pdb
import re
import time
import urllib
from selenium import webdriver
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.action_chains import ActionChains
from selenium.common.exceptions import StaleElementReferenceException

CHROMEDRIVER_LOCATION = '/appdata/bin/chromedriver'

# Using the PageObject pattern per 
#   http://docs.seleniumhq.org/docs/06_test_design_considerations.jsp
class MapApplicationPage:
  def __init__(self, browser, pageUrl):
    self.browser = browser
    self.browser.get(pageUrl)

  def checkTitle(self, expectedTitle):
    try:
      WebDriverWait(self.browser, 3).until(EC.title_contains(expectedTitle))
    except TimeoutException as e:
      actualTitle = self.browser.title
      print "Uh-oh: page title was '" + actualTitle + "', but I expected '" + expectedTitle  + "'"
      raise

  def tearDown(self):
    self.browser.quit()

  
  # TODO There are better ways to do this
  def doAndWait(self, func, value):
    func(value)
    time.sleep(1)


  def doesMarkerExistForUrlFragment(self, urlFragment):
    try:
      WebDriverWait(self.browser, 4).until(
        EC.presence_of_element_located((By.CLASS_NAME, 'leaflet-marker-icon')))
    except TimeoutException:
      return False

    # The teardrop marker shows up before the city markers, so wait a minute
    time.sleep(1)

    # Must troll through the markers to see if any are actual like "teardrop"
    # markers, not just city names.  The "teardrop" markers have src which
    # includes marker-icon.png.
    markers = self.browser.find_elements_by_class_name("leaflet-marker-icon")
    for marker in markers:
      try:
        if(marker.is_displayed() and urlFragment in marker.get_attribute('src')):
          return True
      # Sometimes this can get markers which are no longer attached
      # to the DOM.  Those don't count either.
      except StaleElementReferenceException:
        pass

    return False


  # Note: this is a marker in mapzarf-speak, not a marker in leaflet-speak.
  # It's an upside-down teardrop-y shaped thing which opens into an infowindow.
  # The distinction is important because city names are also implemented as
  # what leaflet calls markers.
  def doesTeardropMarkerExist(self):
    return self.doesMarkerExistForUrlFragment('marker-icon.png')

  # http://localhost/maps/mapeteria2/makeCityLabel.php?cityName=New%20York
  def doesLabelExistForCityNamed(self, cityName):
    urlFragment = 'makeCityLabel.php?cityName='+urllib.quote(cityName)
    return self.doesMarkerExistForUrlFragment(urlFragment)

  # To look for particular layer types, look for 
  def tileLayerOfTypeAndAttributeExists(self, tileType, attributeName):
    translation = { 'choropleth' : 'choropleth.phpx',
                    'dot' : 'dots.php',
                    'border' : 'choropleth.phpx' }
    tileClassName = 'leaflet-tile'
    executableName = translation[tileType]

    # Let the tiles load
    try:
      WebDriverWait(self.browser, 3).until(
        EC.presence_of_element_located((By.CLASS_NAME, tileClassName)))
    except TimeoutException:
      return False

    tiles = self.browser.find_elements_by_class_name(tileClassName)
    for tile in tiles:
      src = tile.get_attribute('src')
      if (executableName in src) and (attributeName in src):
        return True

    return False

  def choroplethTileAtCoordinatesExists(self, x, y, z):
    coordinateString = "x=" + str(x) + "&y=" + str(y) + "zoom=" + str(z)
    return self.tileLayerOfTypeAndAttributeExists('choropleth', 
                                                  coordinateString)

  def choroplethTileForAttributeExists(self, attributeName): 
    urlFragment = 'field=' + attributeName + "&"
    return self.tileLayerOfTypeAndAttributeExists('choropleth', 
                                                  urlFragment)
 
  def borderTileForTypeExists(self, borderLayerType): 
    urlFragment = 'polyType=' + borderLayerType + "&"
    hasBorderType = self.tileLayerOfTypeAndAttributeExists('choropleth', 
                                                  urlFragment)
    isBorder = self.tileLayerOfTypeAndAttributeExists('border', 
                                                  'border=solid')
    return isBorder & hasBorderType
   
  def dotTileForAttributeExists(self, dotAttributeName):
    urlFragment = 'name=' + dotAttributeName + "&"
    return self.tileLayerOfTypeAndAttributeExists('dot', urlFragment)
 
 
  def getTitle(self):
    return self.browser.title

  def setCheckbox(self, idString, shouldCheck):
    element = self.browser.find_element_by_id(idString)
    if shouldCheck != element.is_selected:
      element.click()

  def showAsCartogram(self, value):
    self.setCheckbox('isCartogramCheckbox', value)

  def showLayerset(self, layersetName, value):
    self.setCheckbox(layersetName + 'Checkbox', value)


#  def showDots(self, value):
#    self.setCheckbox('dotLayersCheckbox', value)
#
#  def showChoropleths(self, value):
#    self.setCheckbox('choroplethLayersCheckbox', value)
#
#  def showBorders(self, value):
#    self.setCheckbox('borderLayersCheckbox', value)

  def areCitiesVisible(self):
    try:
      element = self.browser.find_element_by_id('showCitiesCheckbox')
    except:
      return False

    return True
   

  def showCities(self, value):
    self.setCheckbox('showCitiesCheckbox', value)

  def getTitle(self):
    return self.browser.title

  def getDescriptionForLayer(self, layersetName):
    elementName = layersetName + "Description"
    print "looking for element with id " + elementName
    element = self.browser.find_element_by_id(elementName)
    return element.text

  def getDescription(self, layersetName):
    return self.browser.find_element_by_id(layersetName + 'Description').text

#  def getChoroplethDescription(self):
#    return self.browser.find_element_by_id("choroplethLayersDescription").text
#
#  def getDotDescription(self):
#    return self.browser.find_element_by_id("dotLayersDescription").text
#
#  def getBorderDescription(self):
#    return self.browser.find_element_by_id("borderLayersDescription").text

  def getSharingUrl(self):
    return self.browser.find_element_by_id('sharingUrl').get_attribute('href')

  def changeLayerToIndex(self, layersetName, index):
    selector = Select(self.browser.find_element_by_id(layersetName + "Selector"))
    selector.select_by_index(index)

  def changeLayerToNameFragment(self, layersetName, nameFragment):
    selector = self.browser.find_element_by_id(layersetName + "LayersSelector")
    selector.select_by_visible_text(nameFragment)

#  def changeDotLayerToIndex(self, index):
#    self.changeLayerToIndex('dotLayers', index)
#
#  def changeChoroplethLayerToIndex(self, index):
#    self.changeLayerToIndex('choroplethLayers', index)
#
#  def changeBorderLayerToIndex(self, index):
#    self.changeLayerToIndex('borderLayers', index)

  # I could do this en masse, but I want to find out which
  # checkbox had problems.
  def setAllCheckboxesTo(self, aBoolean):
    checkboxes = self.browser.find_elements_by_tag_name("input")
    for checkbox in checkboxes:
      if(checkbox.get_attribute('checked') != aBoolean):
        checkbox.click()

  def checkAllCheckboxes(self):
    self.setAllCheckboxesTo(True)

  def uncheckAllCheckboxes(self):
    self.setAllCheckboxesTo(False)

  def clickOnDotTile(self, x, y, z):
    # This will wait until *some* tile will be clickable, but
    # note that won't help when zooming because the old tiles
    # will still be clickable.
    WebDriverWait(self.browser, 7).until(
       EC.element_to_be_clickable((By.CLASS_NAME,'leaflet-tile-loaded')))    

    # It sometimes takes a while for ALL of the tiles to load
    time.sleep(1)
    tiles = self.browser.find_elements_by_class_name("leaflet-tile-loaded")

    # We have to get a tile in the topmost layer, which is usually the 
    # dots layer
    dotTile = None
    for tile in tiles:
      queryString = 'x=' +  str(x) + '&y=' + str(y) + '&zoom=' + str(z)
      urlFragment = 'dots.php?' + queryString
      
      if urlFragment in tile.get_attribute('src'):
        dotTile = tile
        break

    dotTile.click()
    time.sleep(1)


  def zoomIn(self):
    self.browser.find_element_by_class_name("leaflet-control-zoom-in").click()

  def zoomOut(self):
    self.browser.find_element_by_class_name("leaflet-control-zoom-out").click()

  # Note: after a zoom in/out, the previous tiles are still
  # hanging around, so you have to look through ALL the tiles to 
  # figure out what the min/max are
  def getMinZoom(self):
    try:
      WebDriverWait(self.browser, 3).until(
            EC.presence_of_element_located((
                By.CLASS_NAME, 'leaflet-tile-loaded')))
    except TimeoutException as e:
      print "Uh-oh: page tiles never loaded!"
      raise

    tiles = self.browser.find_elements_by_class_name("leaflet-tile-loaded")
    minZoom = 32   # excessively high
    for tile in tiles:
      try:
        src = tile.get_attribute('src')
        zoomRegexp = re.compile(r'zoom=\d+')
        currentZoom = int(zoomRegexp.findall(src)[0].replace('zoom=', ''))
        minZoom = min(currentZoom, minZoom)
        continue
      except StaleElementReferenceException:
        continue

    return minZoom

  def getMaxZoom(self):
    try:
      WebDriverWait(self.browser, 3).until(
            EC.presence_of_element_located((
                By.CLASS_NAME, 'leaflet-tile-loaded')))
    except TimeoutException as e:
      print "Uh-oh: page tiles never loaded!"
      raise

    tiles = self.browser.find_elements_by_class_name("leaflet-tile-loaded")
    maxZoom = -1   # excessively low
    for tile in tiles:
      try:
        src = tile.get_attribute('src')
        zoomRegexp = re.compile(r'zoom=\d+')
        currentZoom = int(zoomRegexp.findall(src)[0].replace('zoom=', ''))
        maxZoom = max(currentZoom, maxZoom)
        continue
      except StaleElementReferenceException:
        continue

    return maxZoom


  def getLegendUrls(self):
    WebDriverWait(self.browser, 4).until(
      EC.presence_of_element_located((By.CLASS_NAME, 'legendImage')))
    legends = self.browser.find_elements_by_class_name("legendImage")
    urls = []
    for legend in legends:
      urls.append(legend.get_attribute('src'))

    return urls

  def getPageUrl(self):
    WebDriverWait(self.browser, 2).until(
            EC.presence_of_element_located((By.ID, 'map')))
    return self.browser.current_url

