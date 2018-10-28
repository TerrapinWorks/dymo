/***********************************************************************************
This file programs the popup that is triggered by clicking on the chrome extention
**********************************************************************************/

// Start listening for button click when popup.html loads
document.addEventListener('DOMContentLoaded', function() {
  // Create listener for the button
  var printButton = document.getElementById('printButton');
  printButton.addEventListener('click', buttonClicked, false)
}, false);

// When button is pressed scrape the web and send info to receiveMessage
function buttonClicked() {
	// Get an object for the active tab
  console.log("button has been clicked");
	chrome.tabs.query({active: true, currentWindow: true}, function(tab_array){
		// send a messege to the contentscript that will then scrape the web
    // it will then call the popup.js receiveURL() method with the url it makes
    console.log("Messege sent to conntent script");
		chrome.tabs.sendMessage(tab_array[0].id, true, receiveURL);
	});
}

// When message is received, attempt to connect to API
// at this point we should have the full working url for tha Request
function receiveURL(url) {
  // if the web scraper fails (it will either return scrapeFailed or the url could be really long)
  console.log(url);
  if(url=="scrapeFailed"){

    // remove the print button
    printButton.parentNode.removeChild(printButton);
    // explain that request failed and give them link for manual page, then show them the webscrape error page
    document.getElementById('text').innerHTML = "<br/>Request Failed, click<a target='_blank' href='http://labelserver:8081/'> here </a>for manual input <br/>" +
     "For more infromation on this error click <a target='_blank' href='http://labelserver:8081/scrape.html'> here</a>";
    document.body.style.width = '400px'; // set pop up to be a bit wider to fit text well

  }
  // otherwise the request should pretty much work
  else{
    httpRequest = new XMLHttpRequest();
    // this will invoke onServerResponse() when server responds
    httpRequest.onreadystatechange = onServerResponse;
    httpRequest.open("GET", url, true);
    // because all the paremeters are sent in the URL, no method body needed
    httpRequest.send(null);
  }
}//.. end of receiveURL()

// this deals with the servers request
function onServerResponse() {

  if (httpRequest.readyState == XMLHttpRequest.DONE) {
  // at this point the server should have handled the request

  printButton.parentNode.removeChild(printButton); // remove the print button

  // if server sends back an okay and a sucess that means everything printed
	if (httpRequest.status == 200 && httpRequest.response=="success" ){
	   // change the text to the fact that request was sent to printer
     document.getElementById('text').innerHTML = "Printing infromation :)";
  	// Auto close after 2.1 seconds
		window.setTimeout(window.close, 2100);
	}
  // else means that most lilkey the server is not online (I cant think of any other problems)
  else{
      // explain that the server is down and and show a link to an internal webpage on how to fix it
			document.getElementById('text').innerHTML = "Opps.. looks like the server is down :(  <br/> " +
      "For more infromation on this error click <a target='_blank' href='server-down.html'> here </a>";
      document.body.style.width = '300px';
    }
  }
}
