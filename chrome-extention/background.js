/*******************************************************************************
This file makes sure the chrome-extention is only active on the jobs page
*******************************************************************************/
chrome.tabs.onUpdated.addListener(check);

function check (tab_id, data, tab) {
	// Makes sure that we are on an Innovation center job page
	if (tab.url.indexOf('umd.innovationcenter.makerbot.com/jobs/') > -1) {
		chrome.pageAction.show(tab_id);
		chrome.tabs.executeScript(tab_id, {file: "contentscript.js"}, function(){});
	}
}
