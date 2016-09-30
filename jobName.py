#imports 
import os
import re
import time
from datetime import date
from bs4 import BeautifulSoup

# setup
fname = "/home/pi/LabelMaker/label.html"
#fname = "MakerBot Innovation Center.html"
soup = BeautifulSoup(open(fname), 'html.parser')
out = "/home/pi/LabelMaker/clipboard.txt"
#out = "clipboard.txt"

#parse
nameGetter = soup.find_all(text = re.compile("^Requestor"))[0].next
jobNum = soup.find_all(text = re.compile("^Job"))[2].next.rstrip("\n")
emailGetter = soup.find_all(text = re.compile("^Requestor Email"))[0].next.next.next_element
#cost = soup.find_all(text = re.compile("^Cost"))[0].next
today = str(date.today())

try:
    cost = soup.find_all(text = re.compile("^Cost"))[0].next
except:
    cost = soup.find_all(text = re.compile("^Estimated Cost"))[0].next

#format
nameSplitter = nameGetter.split()
lastName = nameSplitter[1]
firstName = nameSplitter[0]

#write to clipboard txt
f = open(out, 'w+')
lineOne = (lastName,", ",firstName,'\n', emailGetter, jobNum, cost, today)
f.writelines(lineOne)
f.close()

#send printer command
os.system("lpr -P DYMO_LabelWriter_450_Turbo -o PageSize=Custom.20x80mm -o landscape /home/pi/LabelMaker/clipboard.txt")
