import time
from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait # available since 2.4.0
from selenium.webdriver.support import expected_conditions as EC # available since 2.26.0

driver = webdriver.Chrome('/appdata/bin/chromedriver')  # Optional argument, if not specified will search path.
driver.get('http://localhost/maps/demos/taxRoi/mapzarf.html');
time.sleep(5) # Let the user actually see something!
# search_box = driver.find_element_by_name('q')
# search_box.send_keys('ChromeDriver')
# search_box.submit()

try:
    # we have to wait for the page to refresh, the last thing that seems to be updated is the title
    WebDriverWait(driver, 10).until(EC.title_contains("Tax"))

    # You should see "Federal Spending Per Tax Dollar" on the console
    print driver.title

finally:
    driver.quit()
# time.sleep(5) # Let the user actually see something!
# driver.quit()

