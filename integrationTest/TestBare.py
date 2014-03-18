import unittest
import time
from MapApplicationPage import MapApplicationPage
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException

CHROMEDRIVER_LOCATION = '/appdata/bin/chromedriver'
TEST_URL = 'http://localhost/mapzarf/integrationTest/testBare.html'
PAGE_TITLE = "TestBare pageTitle"


# @@@ TODO more tests: test and make sure that at a minimum, one
# @@@ layer shows up
class TestSanity(unittest.TestCase):

  # Is there a way to not do this overhead every time?
  def setUp(self):
    self.browser = webdriver.Chrome(CHROMEDRIVER_LOCATION)
    self.page = MapApplicationPage(self.browser, TEST_URL)
    self.page.checkTitle(PAGE_TITLE)

  def tearDown(self):
    self.page.tearDown()
    

  # Tests ----------------

  def testLegendExistence(self):
    legendUrl = self.page.getLegendUrl()
    pieces = legendUrl.split("/")
    self.assertTrue(pieces[-1] == "webfoot.gif")


if __name__ == "__main__":
    unittest.main()
