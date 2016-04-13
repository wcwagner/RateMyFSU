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
}
var queryBaseUrl = "http://www.ratemyprofessors.com/search.jsp?queryBy=teacherName"+
								"&schoolName=florida%20state%20university&queryoption=HEADER"+
								"&query=";
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse){
		if(request.profNames.length > 0){
			request.profNames.forEach(function(prof){
				var queryUrl = queryBaseUrl + prof + "&facetSearch=true";
				console.log(queryUrl);
			});
		}
		sendResponse({farewell: "goodbye"});
	});
var url = "http://www.ratemyprofessors.com/search.jsp?queryBy=teacherName&schoolName=florida%20state%20university&queryoption=HEADER&query=xiuwen%20liu&facetSearch=true";
var xhr = new XMLHttpRequest();
xhr.open("GET", url, true);
xhr.send();
xhr.onreadystatechange = function(){
	if( xhr.readyState == 4 && xhr.status == 200){
		console.log("Success");
		// Turn XMLHttpresponse into jQuery dom object
		var $responseDOM = $($.parseHTML(xhr.response));
		var teacherHref = $responseDOM.find('li[class="listing PROFESSOR"] a').attr('href');
		//grab teacher id from href
		var profPageUrl = "http://ratemyprofessors.com" + teacherHref;
		console.log(profPageUrl);
		/*var ratingXHR = new XMLHttpRequest();
		ratingXHR.open(GET)
		ratingXHR.send();
		ratingXHR.onreadystatechange = function(){
			if( ratingXHR.readyState == 4 && ratingXHR.status == 200){
				$ratingDOM = $($.parseHTML(ratingXHR.response));
				var rating = $ratingDOM.find('div[class="grade"]').text();
			}
		};*/
	}
};

