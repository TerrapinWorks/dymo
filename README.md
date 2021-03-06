# DYMO
<p id="intro">
  This repository contains the code used to automate the label making process at the MIC. 
  The Dymo labelmaker is connected to a Raspberry Pi that is connected to the Terrapin Works network. 
  This allows lab managers to print labels for clients' prints. This code only works within the Terrapin Works wifi.
</p>

<h2>Chrome Extension</h2>
<p id="chrome_extension">
  The chrome_extension folder has the code for the 
  <a href="https://chrome.google.com/webstore/detail/terrapin-works-label-prin/hlmhjakokajncnencjkhieokhpkdilfl">
	  Terrapin Works Label Printing Chrome Extension
  </a>.
  This extension enables one-click printing of labels from a job page on the Innovation Center platform.
  <br> 
  Detailed documentation for the extension is available 
  <a href="https://docs.google.com/a/eng.umd.edu/document/d/12CAjwy1aIZTeaBpE2GL8NS2cRC6DzNVWBN9W_5VUYUk/edit?usp=sharing">
    here on Google Drive
  </a>
  <img src="https://docs.google.com/document/d/1lXl1l3ZjlJ_rZeJoF8O5Fl5HisoVmZqCW_jiMykETzM/edit" width="500px"/>
</p>

<h2>ter.ps/twlabels</h2>
<p id="twlabels">
  In addition to the Chrome Extension, the Pi is hosting a static webpage that allows direct upload of the HTML of a job page. Go to
  <a href="http://ter.ps/twlabels">
    http://ter.ps/twlabels
  </a>
  for instructions on how to use the labelmaker this way.
</p>
