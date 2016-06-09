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


chrome.runtime.onConnect.addListener(function(port) {
	port.onMessage.addListener(function(msg){
		var profName = Object.keys(msg)[0];
		var queryUrl = queryBaseUrl + profName + "&facetSearch=true";
		$.ajax({
			url: queryUrl,
			success: function(htmlStr){
			// Turn XMLHttpresponse into jQuery dom object
				var $responseDOM = $($.parseHTML(htmlStr));
				var teacherHref = $responseDOM.find('li[class="listing PROFESSOR"] a').attr('href');
				if(teacherHref && profName !== "Staff"){
					var profPageUrl = "http://ratemyprofessors.com" + teacherHref;
					$.ajax({
						url: profPageUrl,
						success: function(profPageHtml){
							$ratingDOM = $($.parseHTML(profPageHtml));
							var rating = $ratingDOM.find('div[class="grade"]').text();
							var ratings = editRatingText(rating);
							console.log(ratings)
							msg[profName][0] = ratings;
							msg[profName][1] = profPageUrl;
							port.postMessage(msg);
						},
						error: function(XMLHttpRequest, textStatus, errorThrow){

						}
					});
				}
				else{
					msg[profName][0] = null;
					port.postMessage(msg);
				}
				//grab teacher id from href

			},
			error: function(XMLHttpRequest, textStatus, errorThrow){

			}

		});
	});
});
function editRatingText(rating){
	var ratings_arr = rating.match(/[0-9].[0-9][A-z]?\/?[A-z]?/g);
	var overallRating = ratings_arr[0];
	var difficultyRating = ratings_arr[1];
	return [overallRating, difficultyRating];

}
chrome.tabs.onUpdated.addListener(checkForValidUrl);
