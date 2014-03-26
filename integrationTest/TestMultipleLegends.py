# These are tests to make sure we can have lots of layers and deal properly 
# with multiple legends.

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
MULTIPLE_LEGENDS_URL = 'http://localhost/mapzarf/integrationTest/testLegends.html'
PAGE_TITLE = "Test multiple legends"

class TestWrong(unittest.TestCase):

  # Is there a way to not do this overhead every time?
  def setUp(self):
    self.browser = webdriver.Chrome(CHROMEDRIVER_LOCATION)
    self.page = MapApplicationPage(self.browser, MULTIPLE_LEGENDS_URL)
    self.page.checkTitle(PAGE_TITLE)

  # Tests 

  def testLegends(self):
    self.assertTrue(len(self.page.getLegendUrls()) == 2)
    self.page.showLayerset('choropleth1', False)
    time.sleep(2)
    self.assertTrue(len(self.page.getLegendUrls()) == 1)

  def tearDown(self):
    self.page.tearDown()
    

#---- End class Tester

if __name__ == "__main__":
    unittest.main()
