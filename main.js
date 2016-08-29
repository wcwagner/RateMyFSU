var timeOut = null;
var port = chrome.runtime.connect({name: "getProfessors"});
function delayedListener(){
	timeOut = window.setTimeout(checkForSearchResultsPage, 500);
}
function cancelListener(){
	window.clearTimeout(timeOut);

}
function checkForSearchResultsPage(){
	if(document.getElementById("MTG_INSTR$0"))
		grabProfessors();
}



function grabProfessors(){
	var profToIds = {};
	var getNameRegex = /[A-z]+\ ?[A-z]+/;
	var count = 0;
	var currProfId = "MTG_INSTR$" + count;
	var currProfName = "";
	do{
		currProfId = "MTG_INSTR$" + count;
		currProfElem = document.getElementById(currProfId);
		if( currProfElem){
			currProfName = currProfElem.innerHTML.match(getNameRegex);
			//no entry for the current professor
			if(!profToIds[currProfName]){
				profToIds[currProfName] = []
			}
			//keep track of all the id's that a professor is associated with on page
			profToIds[currProfName].push(currProfId);
		}
		count++;
	}while(currProfElem !== null);
	//ajax requests to get info from ratemyprofessor
	getProfessorSearchPage(profToIds);
}

function getProfessorSearchPage(profToIds){
	var queryBaseUrl = "http://www.ratemyprofessors.com/search.jsp?queryBy=teacherName"+
								"&schoolName=florida%20state%20university&queryoption=HEADER"+
								"&query=";
	for(var profName in profToIds){
		var requestUrl = queryBaseUrl + profName + "&facetSearch=true";
		chrome.runtime.sendMessage({
			url: requestUrl,
			method: "POST",
			action: "xhttp",
			name: profName,
			ids: profToIds[profName]
		},
			//the callback
			function(response){
				var $responseDOM = $($.parseHTML(response.htmlStr));
				var teacherHref = $responseDOM.find('li[class="listing PROFESSOR"] a').attr('href');
				var ratingPageUrl = null
				if(teacherHref && profName !== "Staff"){
					ratingPageUrl = "http://ratemyprofessors.com" + teacherHref;
					getProfessorRatings(ratingPageUrl, response.name, response.ids)
				}
				else{
					addNoRatingToDom(response.profName, response.ids)
				}
			}
		);
	}
}
function getProfessorRatings(ratingPageUrl, profName, profIds){
	if(ratingPageUrl){
		chrome.runtime.sendMessage({
			url: ratingPageUrl,
			method: "POST",
			action: "xhttp",
			name: profName,
			ids: profIds
		},
			function(response){
				$ratingDOM = $($.parseHTML(response.htmlStr));
				var ratingStr = $ratingDOM.find('div[class="grade"]').text();
				var ratings = extractRatingsFromStr(ratingStr);
				addRatingToDom(response.name, response.ids, ratings, ratingPageUrl)
			});
	}
}
function extractRatingsFromStr(ratingStr){
	var ratings_arr = ratingStr.match(/[0-9].[0-9][A-z]?\/?[A-z]?/g);
	var overallRating = ratings_arr[0];
	var difficultyRating = ratings_arr[1];
	return [overallRating, difficultyRating];

}

function addRatingToDom(profName, ids, ratings, ratingPageUrl){

	var overallRating = ratings[0];
	var difficultyRating = ratings[1];
	if(overallRating && overallRating !== "0.0")
		var overallElem = "<p><span style='font-weight:bold'>Rating: </span>" + overallRating + "</p>";
	else{
		console.log(profName, overallRating)
		var overallElem = "<p><span style='font-weight:bold'>Rating: </span>N/A</p>"}

	if(difficultyRating && difficultyRating !== "0.0")
		var difficultyElem = "<p><span style='font-weight:bold'>Difficulty: </span>" + difficultyRating + "</p>";
	else{
		console.log(profName, difficultyRating)
		var difficultyElem = "<p><span style='font-weight:bold'>Difficulty: </span>N/A</p>";
	}
	var profUrlElem = "<a target='_blank'href='" + ratingPageUrl + "'>Ratings Page</a>";
	for(var i = 0; i < ids.length; i++){
		$(document.getElementById(ids[i])).append(overallElem);
		$(document.getElementById(ids[i])).append(difficultyElem);
		$(document.getElementById(ids[i])).append(profUrlElem);
	}
}
function addNoRatingToDom(profName, ids){
	var noDataElem = "<p>No data available</p>";
	for(var i = 0; i < ids.length; i++){
		$(document.getElementById(ids[i])).append(noDataElem);
	}
}

var observer = new MutationObserver(function(mutations){
	mutations.forEach(function(mutation){
		//The target that is affected when the class search page is reached
		if(mutation.target.id == "win0divPSHIDDENFIELDS" ){
			cancelListener();
			delayedListener();
		}
	});
});

var config = {
	subtree: true,
	childList: true,
};
var targetNode = document;

observer.observe(targetNode, config);

