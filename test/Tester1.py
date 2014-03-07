import time
from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC # available since 2.26.0
from selenium.webdriver.support.ui import Select
from selenium.webdriver.support.ui import WebDriverWait # available since 2.4.0

class PageBehavior(driver):
  def __init__:
    this.driver = driver
    WebDriverWait(driver, 2).until(EC.title_contains("Test1"))
    if driver.title != "Test1 pageTitle":
      print "Uh-oh, it's not the exact right title."
      print "Found: " + driver.title

  def setCheckbox(idString, shouldCheck):
    element = driver.find_element_by_id(idString)
    if shouldCheck:
      check(element)
    else:
      uncheck(element)

  def showAsCartogram(bool value):
    setCheckbox('isCartogramCheckbox', value)

  def showDots(bool value):
    setCheckbox('dotLayersCheckbox', value)

  def showChoropleths(bool value):
    setCheckbox('choroplethLayersCheckbox', value)

  def showBorders(bool value):
    setCheckbox('borderLayersCheckbox', value)

  def showCities(bool value):
    setCheckbox('showCities', value)
    
# end PageBehavior ---------------
    
class Tester:
  def __init__:
    this.failures = 0
    this.driver = webdriver.Chrome('/appdata/bin/chromedriver')  

  def doAndWait(func, value):
    func(value)
    time.sleep(1)
    
  def sanityTest: 

  def sanityCheckTitle:
    this.driver.get('http://localhost/mapzarf/test/test1.html');
    try:
        WebDriverWait(driver, 2).until(EC.title_contains("Test1"))
    
        # You should see "Federal Spending Per Tax Dollar" on the console
        if driver.title != "Test1 pageTitle":
          print "Uh-oh, it's not the exact right title."
          print "Found: " + driver.title
          failures += 1
    except:
        print "Uh-oh, I didn't see the correct title!"
        failures += 1
    
    finally:
        if failures > 0:
          print "I saw " + str(failures) + " failures, alas."
        time.sleep(1) # Let the user actually see something!


  def uncheckAll():
    functions = [this.driver.showCartogram,
                 this.driver.showDots,
                 this.driver.showChoropleths,
                 this.driver.showBorders,
                 this.driver.showCities,
                 this.driver.showAsCartogram]

    for func in functions:
      doAndWait(func, value)

#---- End class Tester

