#imports 
import os
import re
import time
from datetime import date
from bs4 import BeautifulSoup

# setup
fname = "/home/pi/dymo/label.html"
soup = BeautifulSoup(open(fname), 'html.parser')
out = "/home/pi/dymo/clipboard.txt"

#parse
nameGetter = soup.find_all(text = re.compile("^Requestor"))[0].next
jobNum = soup.find_all(text = re.compile("^Job"))[2].next.rstrip("\n")
emailGetter = soup.find_all(text = re.compile("^Requestor Email"))[0].next.next.next_element
today = date.today().strftime("%d/%m/%y")
try:
  # Case 1: Job marked as completed
  cost = soup.find_all(text = re.compile("^Cost"))[0].next
except:
  # Case 2: Job marked as harvesting
  cost = soup.find_all(text = re.compile("^Estimated Cost"))[0].next
cost = cost[-6:-1]

try:
  request_name = soup.find_all(text = re.compile("^Request:"))[0].next
  # Remove newline from request_name
  request_name = request_name[0:-1]
except:
  # Direct prints have no request name
  request_name = "";

#format
nameSplitter = nameGetter.split()
lastName = nameSplitter[1]
firstName = nameSplitter[0]

emailSplitter = emailGetter.split('@')
emailName = emailSplitter[0]
emailAddress = emailSplitter[1]

#write to clipboard txt
f = open(out, 'w+')
#lineOne = (lastName,", ",firstName, '\n', emailGetter, request_name, jobNum, '\nCost: ', cost, '\n', today)
lineOne = (lastName,",\n",firstName, '\n\n', emailName, '\n','@',emailAddress, '\n', jobNum, '\nCost:\n', cost, '\n\n', today)
f.writelines(lineOne)
f.close()

#send printer command
#os.system("lpr -P DYMO_LabelWriter_450_Turbo -o PageSize=Custom.51x59mm -o landscape /home/pi/dymo/clipboard.txt") 
os.system("lpr -P DYMO_LabelWriter_450_Turbo -o portrait /home/pi/dymo/clipboard.txt") 
