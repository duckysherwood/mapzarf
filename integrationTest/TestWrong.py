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

  def checkAlert(self, urlString):
    try:
      self.page = MapApplicationPage(self.browser, urlString)
      WebDriverWait(self.browser, 3).until(
          EC.presence_of_element_located((By.TAG_NAME, 'title')))


    except UnexpectedAlertPresentException as e:
      alertText = Alert(self.browser).text
      if alertText and ("layer is not valid, alas" in alertText):
        Alert(self.browser).accept()
        return True
    
    return False


  # Tests 
  def testWronglyTypedValues(self):
    urlString = 'http://localhost/mapzarf/integrationTest/testWrong1.html'
    self.assertTrue(self.checkAlert(urlString))

  # TODO This should go in incomplete
  def testMismatchedDotProjectionTableField(self):
    urlString = 'http://localhost/mapzarf/integrationTest/testWrong2.html'
    self.assertTrue(self.checkAlert(urlString))
    
  def testMissingDotTable(self):
    urlString = 'http://localhost/mapzarf/integrationTest/testWrong3.html'
    self.assertTrue(self.checkAlert(urlString))
    
  # TODO this should go in incomplete
  def testMissingDotFieldTable(self):
    urlString = 'http://localhost/mapzarf/integrationTest/testWrong4.html'
    self.assertTrue(self.checkAlert(urlString))

  def testMismatchedTablePolyYear1(self):
    urlString = 'http://localhost/mapzarf/integrationTest/testWrong5.html'
    self.assertTrue(self.checkAlert(urlString))

  def testMismatchedTablePolyYear2(self):
    urlString = 'http://localhost/mapzarf/integrationTest/testWrong6.html'
    self.assertTrue(self.checkAlert(urlString))
    
  # TODO this should go in incomplete
  def testMissingChoroplethTablePolyYear(self):
    urlString = 'http://localhost/mapzarf/integrationTest/testWrong7.html'
    self.assertTrue(self.checkAlert(urlString))
    

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
