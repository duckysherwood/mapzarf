# These tests is designed to test a MAI which is wrong: syntactically
# correct, but semantically incorrect

import unittest
import time
from MapApplicationPage import MapApplicationPage
from selenium import webdriver
from selenium.webdriver.common.alert import Alert
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from selenium.common.exceptions import UnexpectedAlertPresentException

CHROMEDRIVER_LOCATION = '/appdata/bin/chromedriver'

class TestWrong(unittest.TestCase):

  # Is there a way to not do this overhead every time?
  def setUp(self):
    self.browser = webdriver.Chrome(CHROMEDRIVER_LOCATION)
    self.page = None

  def checkAlert(self, urlString, message):
    try:
      self.page = MapApplicationPage(self.browser, urlString)
      WebDriverWait(self.browser, 6).until(
          EC.presence_of_element_located((By.TAG_NAME, 'dotLayersCheckbox')))


    except UnexpectedAlertPresentException as e:
      alertText = Alert(self.browser).text
      if alertText and (message in alertText):
        Alert(self.browser).accept()
        return True
      else:
        print "Expected " + message + " and got " + alertText
        Alert(self.browser).accept()
        return False
    
    return False


  # Tests 
  def testWrongMailyTypedValues(self):
    urlString = 'http://localhost/mapzarf/integrationTest/testWrongMai1.html'
    message = "map application info file is invalid"
    self.assertTrue(self.checkAlert(urlString, message))

  # TODO This should go in incomplete
  def testMismatchedDotProjectionTableField(self):
    urlString = 'http://localhost/mapzarf/integrationTest/testWrongMai2.html'
    message = "layer is not valid, alas"
    self.assertTrue(self.checkAlert(urlString, message))
    
  def testMissingDotTable(self):
    urlString = 'http://localhost/mapzarf/integrationTest/testWrongMai3.html'
    message = "layer is not valid, alas"
    self.assertTrue(self.checkAlert(urlString, message))
    
  # TODO this should go in incomplete
  def testMissingDotFieldTable(self):
    urlString = 'http://localhost/mapzarf/integrationTest/testWrongMai4.html'
    message = "layer is not valid, alas"
    self.assertTrue(self.checkAlert(urlString, message))

  def testMismatchedTablePolyYear1(self):
    urlString = 'http://localhost/mapzarf/integrationTest/testWrongMai5.html'
    message = "Choropleth layer is not valid, alas"
    self.assertTrue(self.checkAlert(urlString, message))

  def testMismatchedTablePolyYear2(self):
    urlString = 'http://localhost/mapzarf/integrationTest/testWrongMai6.html'
    message = "Choropleth layer is not valid, alas"
    self.assertTrue(self.checkAlert(urlString, message))
    
  # TODO this should go in incomplete
  def testMissingPolyShapeYear(self):
    urlString = 'http://localhost/mapzarf/integrationTest/testWrongMai7.html'
    message = "Choropleth layer is not valid, alas"
    self.assertTrue(self.checkAlert(urlString, message))
    
  # hasCartogram is set, but there are no cartogram layers
  def testMissingChoroplethPolyShapeYear(self):
    urlString = 'http://localhost/mapzarf/integrationTest/testWrongMai8.html'
    message = "layer for the cartogram projection"
    self.assertTrue(self.checkAlert(urlString, message))

  def tearDown(self):
    self.page.tearDown()
    
# Test one where there are misspellings of the keys, e.g. 
# 'cartogram'/'showCartogram'/'showCartograms'/'isCartogram'
# vs the correct 'hasCartogram' (in top part)

# test one which says it has cartogram but doesn't
# have one which says it doesn't have cartogram but does

#---- End class Tester

if __name__ == "__main__":
    unittest.main()
