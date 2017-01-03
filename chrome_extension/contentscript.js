 /* 
	Terrapin Works Label Maker Chrome Extension - popup.js
	@author Adam Anderson
*/

// Listen for message from the Extension (received when button is pressed)
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	// When button is pressed, extract the DOM as text and send it to popup.js
	console.log("Message Received - returning text DOM");
	sendResponse({farewell: "goodbye"});
}); 