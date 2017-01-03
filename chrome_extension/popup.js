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
  printButton.addEventListener('click', function() {	
	// Get an object for the active tab
	chrome.tabs.query({active: true, currentWindow: true}, function(tab_array){ 
		// WHEN BUTTON IS PRESSED, SEND MESSAGE TO CONTENT SCRIPT
		console.log("Sending message to the content script\n");
		chrome.tabs.sendMessage(tab_array[0].id, {getHTML : true}, function(response) {
			// Response will have the string form of the DOM
			console.log("DOM Returned the webpage:\n");
			console.log(response.farewell);
			//document.getElementById('insertDOM').innerHTML = response;	
			
		});		// chrome.tabs.sendMessage callback
	});			// chrome.tabs.query callback
  }, false); 	// printButton.addEventListener callback
}, false); 		// document.addEventListener callback