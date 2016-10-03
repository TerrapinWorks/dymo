# dymo
<p>
  This repository contains the code used to automate the label making process at the MIC. The Dymo labelmaker is connected to a Raspberry Pi that is connected to the Terrapin Works network. This allows lab managers to print labels for clients' prints. Go to <a href="http://ter.ps/twlabels">http://ter.ps/twlabels</a> for instructions on how to use the labelmaker.
</p>
<p>
  <b>jobName.py</b> - Python script using the BeautifulSoup HTML parser to extract info from the job pages. Labels are saved to clipboard.txt on the pi, and the print command is executed.
</p>
