# This test is designed to test a MAI which is totally messed up: valid
# JSON but not at all the correct thing.  It should fail completely in
# expected ways.

import unittest
import time
from MapApplicationPage import MapApplicationPage
from selenium import webdriver
from selenium.webdriver.common.alert import Alert
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from selenium.common.exceptions import UnexpectedAlertPresentException

CHROMEDRIVER_LOCATION = '/appdata/bin/chromedriver'

class TestInsanity(unittest.TestCase):

  # Is there a way to not do this overhead every time?
  def setUp(self):
    self.browser = webdriver.Chrome(CHROMEDRIVER_LOCATION)
    self.page = None

  def checkAlert(self, urlString):
    try:
      self.page = MapApplicationPage(self.browser, urlString)

    except UnexpectedAlertPresentException as e:
      alertText = Alert(self.browser).text
      if alertText and ("problem with the JSON file" in alertText):
        Alert(self.browser).accept()
        return True
    
    return False


  def testGoodJson(self):
    urlString = 'http://localhost/mapzarf/test/testSanity.html'
    return not self.checkAlert(urlString)

  def testPlainString(self):
    urlString = 'http://localhost/mapzarf/test/testCorruptMai1.html'
    return self.checkAlert(urlString)

  def testDelimitedString(self):
    urlString = 'http://localhost/mapzarf/test/testCorruptMai2.html'
    return self.checkAlert(urlString)

  def testInvalidJson(self):
    urlString = 'http://localhost/mapzarf/test/testCorruptMai3.html'
    return self.checkAlert(urlString)

  def tearDown(self):
    self.page.tearDown()
    

#---- End class Tester

if __name__ == "__main__":
    unittest.main()
