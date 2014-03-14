# This test is designed to test a MAI which is totally messed up: valid
# JSON but not at all the correct thing.  It should fail completely in
# expected ways.

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

class TestInsanity(unittest.TestCase):

  # Is there a way to not do this overhead every time?
  def setUp(self):
    self.browser = webdriver.Chrome(CHROMEDRIVER_LOCATION)
    self.page = None

  def checkAlert(self, urlString, message):
    try:
      self.page = MapApplicationPage(self.browser, urlString)
      WebDriverWait(self.browser, 3).until(
          EC.presence_of_element_located((By.TAG_NAME, 'title')))


    except UnexpectedAlertPresentException as e:
      alertText = Alert(self.browser).text
      if alertText and (message in alertText):
        Alert(self.browser).accept()
        return True
      else:
        print("Expected " + message + ", got " + alertText)
        return False
    
    return False


  # Tests 
  def testGoodJson(self):
    urlString = 'http://localhost/mapzarf/integrationTest/testSanity.html'
    message = "application info file is invalid"
    self.assertFalse(self.checkAlert(urlString, message))

  def testPlainString(self):
    urlString = 'http://localhost/mapzarf/integrationTest/testCorruptMai1.html'
    message = "There was a problem with the JSON file"
    self.assertTrue(self.checkAlert(urlString, message))

  def testDelimitedString(self):
    urlString = 'http://localhost/mapzarf/integrationTest/testCorruptMai2.html'
    message = "application info file is invalid";
    self.assertTrue(self.checkAlert(urlString, message))

  # MAI3 is a string inside brackets
  def testInvalidJson(self):
    urlString = 'http://localhost/mapzarf/integrationTest/testCorruptMai3.html'
    message = "There was a problem with the JSON file"
    self.assertTrue(self.checkAlert(urlString, message))

  # MAI4 is just like the good one (in testSanity) but it is
  # missing a comma
  def testMissingCommaJSON(self):
    urlString = 'http://localhost/mapzarf/integrationTest/testCorruptMai4.html'
    message = "There was a problem with the JSON file"
    self.assertTrue(self.checkAlert(urlString, message))

  def tearDown(self):
    self.page.tearDown()
    

#---- End class Tester

if __name__ == "__main__":
    unittest.main()
