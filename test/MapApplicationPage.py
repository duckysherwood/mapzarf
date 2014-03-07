import time
from selenium import webdriver
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC # available since 2.26.0
from selenium.webdriver.support.ui import Select
from selenium.webdriver.support.ui import WebDriverWait # available since 2.4.0
from selenium.webdriver.common.action_chains import ActionChains

CHROMEDRIVER_LOCATION = '/appdata/bin/chromedriver'

# Using the PageObject pattern per 
#   http://docs.seleniumhq.org/docs/06_test_design_considerations.jsp
class MapApplicationPage:
  def __init__(self, browser, pageUrl, expectedTitle):
    self.browser = browser
    self.browser.get(pageUrl)
    try:
      WebDriverWait(self.browser, 3).until(EC.title_contains(expectedTitle))
    except Exception as e:
      print e.message + "\n"
      print "Uh-oh, I didn't see the correct title!" 
      actualTitle = self.browser.title
      print "Title was '" + actualTitle + "', expected '" + expectedTitle  + "'"
      raise


  # There are better ways to do this
  def doAndWait(self, func, value):
    func(value)
    time.sleep(1)

  def getTitle(self):
    return self.browser.title

  def setCheckbox(self, idString, shouldCheck):
    element = self.browser.find_element_by_id(idString)
    if shouldCheck != element.is_selected:
      element.click()

  def showAsCartogram(self, value):
    self.setCheckbox('isCartogramCheckbox', value)

  def showDots(self, value):
    self.setCheckbox('dotLayersCheckbox', value)

  def showChoropleths(self, value):
    self.setCheckbox('choroplethLayersCheckbox', value)

  def showBorders(self, value):
    self.setCheckbox('borderLayersCheckbox', value)

  def showCities(self, value):
    self.setCheckbox('showCitiesCheckbox', value)

  def getTitle(self):
    return self.browser.title

  def getDescriptionForLayer(self, layersetName):
    elementName = layersetName + "Description"
    print "looking for element with id " + elementName
    element = self.browser.find_element_by_id(elementName)
    return element.text

  def getChoroplethDescription(self):
    return self.browser.find_element_by_id("choroplethLayers").text

  def getDotDescription(self):
    return self.browser.find_element_by_id("dotLayers").text

  def getBorderDescription(self):
    return self.browser.find_element_by_id("borderLayers").text

  def changeLayerToIndex(self, layersetName, index):
    selector = Select(self.browser.find_element_by_id(layersetName + "Selector"))
    selector.select_by_index(index)

  def changeLayerToNameFragment(self, layersetName, nameFragment):
    selector = self.browser.find_element_by_id(layersetName + "LayersSelector")
    selector.select_by_visible_text(nameFragment)

  def changeDotLayerToIndex(self, index):
    self.changeLayerToIndex('dotLayers', index)

  def changeChoroplethLayerToIndex(self, index):
    self.changeLayerToIndex('choroplethLayers', index)

  def changeBorderLayerToIndex(self, index):
    self.changeLayerToIndex('borderLayers', index)

  # I could do this en masse, but I want to find out which
  # checkbox had problems.
  def setAllCheckboxesTo(self, aBoolean):
    saveFuncName = ""
    functions = [self.showAsCartogram,
                 self.showDots,
                 self.showChoropleths,
                 self.showBorders,
                 self.showCities]

    for func in functions:
      saveFuncName = func.func_name
      self.doAndWait(func, aBoolean)

  def checkAllCheckboxes(self):
    self.setAllCheckboxesTo(True)

  def uncheckAllCheckboxes(self):
    self.setAllCheckboxesTo(False)

  def clickOnDotTile(self, x, y, z):
    # This will wait until *some* tile will be clickable, but
    # note that won't help when zooming because the old tiles
    # will still be clickable.
    WebDriverWait(self.browser, 2).until(
       EC.element_to_be_clickable((By.CLASS_NAME,'leaflet-tile-loaded')))    

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


  def tearDown(self):
    self.browser.quit()

