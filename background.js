// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
var urlMatch = "campus.omni.fsu.edu";
// Called when the url of a tab changes.
function checkForValidUrl(tabId, changeInfo, tab) {
// If the tabs url starts with "http://specificsite.com"...
	if(tab.url.indexOf(urlMatch) != -1){
		console.log(tab.url);
	chrome.pageAction.show(tabId);
	}
	// ... show the page action.


};

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);
