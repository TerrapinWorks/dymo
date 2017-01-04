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
}, false);	// document.addEventListener callback


// When button is pressed, send message to the contentscript
function buttonClicked() {
	// Get an object for the active tab
	chrome.tabs.query({active: true, currentWindow: true}, function(tab_array){ 
		console.log("Button pressed - sending message to the content script\n");
		chrome.tabs.sendMessage(tab_array[0].id, {getHTML : true}, receiveMessage);		// chrome.tabs.sendMessage callback
	});		// chrome.tabs.query callback
}

// When message is received, send to the Pi for processing
function receiveMessage(response) {
	// Response will have the string form of the DOM
	try {
		console.log("DOM Returned the webpage:\n");
		console.log(response.textDOM);
		console.log("\n\n Above is the HTML From the webpage");
		sendToServer(response.textDOM);
	}
	catch(err) {
		console.log("Error running contentscript.js \n" + e.name + "\n" + e.message);
		document.getElementById('error_message').innerHTML  = "Error running contentscript";
		throw new Error("Error running content script");
	}
}

// The string is sent to the server using an XMLHTTPRequest
function sendToServer(message) {
	httpRequest = new XMLHTTPRequest();
	httpRequest.onreadystatechange = function() {
		document.getElementById('error_message').innerHTML = "Message sent to Pi";
	};
	// Pi's static IP address is 192.168.1.92
	httpRequest.open("POST", "192.168.1.92:9292", true);
	// TEST HERE TO MAKE SURE MIME TYPE IS CORRECT
	httpRequest.sendRequestHeader('content-Type', 'text/html');
	httpRequest.send(message);
}