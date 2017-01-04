 /* 
	Terrapin Works Label Maker Chrome Extension - popup.js
	@author Adam Anderson
	
	The code to convert DOM to String is provided by Rob W:
	http://stackoverflow.com/users/938089/rob-w
*/

// Listen for message from the Extension (received when button is pressed)
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	// When button is pressed, extract the DOM as text and send it to popup.js
	console.log("Message Received - returning text DOM");
	
	// @author Rob W <http://stackoverflow.com/users/938089/rob-w
	var html = '',
        node = document.firstChild;
    while (node) {
        switch (node.nodeType) {
        case Node.ELEMENT_NODE:
            html += node.outerHTML;
            break;
        case Node.TEXT_NODE:
            html += node.nodeValue;
            break;
        case Node.CDATA_SECTION_NODE:
            html += '<![CDATA[' + node.nodeValue + ']]>';
            break;
        case Node.COMMENT_NODE:
            html += '<!--' + node.nodeValue + '-->';
            break;
        case Node.DOCUMENT_TYPE_NODE:
            // (X)HTML documents are identified by public identifiers
            html += "<!DOCTYPE " + node.name + (node.publicId ? ' PUBLIC "' + node.publicId + '"' : '') + (!node.publicId && node.systemId ? ' SYSTEM' : '') + (node.systemId ? ' "' + node.systemId + '"' : '') + '>\n';
            break;
        }
        node = node.nextSibling;
    }
		
	var returnString = html;
	sendResponse({textDOM: returnString});
}); 