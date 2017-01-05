/* 
	Terrapin Works Label Maker Chrome Extension - popup.js
	@author Adam Anderson
*/

// For details on message passing between scripts, see 
// https://developer.chrome.com/extensions/messaging#simple

// Start listening for button click when popup.html loads
document.addEventListener('DOMContentLoaded', function() {
  // Create listener for the button
  var printButton = document.getElementById('printButton');
  printButton.addEventListener('click', buttonClicked, false)	
}, false);

// When button is pressed, send message to the contentscript
function buttonClicked() {
	// Get an object for the active tab
	chrome.tabs.query({active: true, currentWindow: true}, function(tab_array){ 
		console.log("Button pressed - sending message to the content script\n");
		chrome.tabs.sendMessage(tab_array[0].id, {getHTML : true}, receiveMessage);
	});		// chrome.tabs.query callback
}

// When message is received, send to the Pi for processing
function receiveMessage(response) {
	// Response will have the string form of the DOM
	try {
		console.log("Content sript returned the webpage:\n");
		console.log(response.textDOM);
		console.log("\n\n Above is the HTML From the webpage");
		sendToServer(response.textDOM);
	}
	catch(err) {
		console.log("Error running contentscript.js \n" + err.name + "\n" + err.message);
		document.getElementById('error_message').innerHTML  = "Error running contentscript  <br> Reload the page to fix this";
		throw new Error("Error running content script");
	}
}

// The string is sent to the server using an XMLHTTPRequest
function sendToServer(message) {
	httpRequest = new XMLHttpRequest();
	httpRequest.onreadystatechange = function() {
		if (httpRequest.readyState == XMLHttpRequest.DONE) {
			// The server is done handling the request
			if (httpRequest.status == 200) {
				// Ok signal sent by the server
				console.log("Message received by Pi:\n" + httpRequest.responseText);
				document.getElementById('error_message').innerHTML = httpRequest.responseText;
			}
		}
		
	};
	// Pi's static IP address is 192.168.1.92
	httpRequest.open("POST", "http://192.168.1.92:9292", true);
	httpRequest.setRequestHeader('Content-Type', 'text/plain');
	httpRequest.send(message);
}