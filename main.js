var targetNode = document;
var timeOut = null;
var port = chrome.runtime.connect({name: "getProfessors"});
function delayedListener(){
	timeOut = window.setTimeout(checkForSearchResultsPage, 500);
	//console.log("Started delayedListener " + timeOut);
}
function cancelListener(){
	//console.log("Cancelling delayedListener " + timeOut);
	window.clearTimeout(timeOut);

}
function checkForSearchResultsPage(){
	if(document.getElementById("MTG_INSTR$0"))
		grabProfessors();
}

function grabProfessors(){
	var regex = /[A-z]+\ ?[A-z]+/;
	var count = 0;
	var currProfId = "MTG_INSTR$" + count;
	var currProfName = "";
	var ProfObj = {};
	do{

		currProfId = "MTG_INSTR$" + count;
		currProfElem = document.getElementById(currProfId);
		if( currProfElem){
			currProfName = currProfElem.innerHTML.match(regex);
			//no entry for the current professor
			if(!ProfObj[currProfName]){
				ProfObj[currProfName] = [];
				//reserved space for rating and profUrl, respectively
				ProfObj[currProfName][0] = "";
				ProfObj[currProfName][1]  = "";
			}
			//keep track of all the id's that a professor is associated with on page
			ProfObj[currProfName].push(currProfId);
		}
		count++;
	}while(currProfElem !== null);
	//ajax requests to get info from ratemyprofessor
	getProfessorRatings(ProfObj);
}

function getProfessorRatings(ProfObj){
	//Only want to send one professor in each object
	for(var prof in ProfObj){
		var msg = {};
		msg[prof] = ProfObj[prof];
		port.postMessage(msg);
	}
}

port.onMessage.addListener(function(message){
	addRatingToDom(message);
});

function addRatingToDom( profObj){
	var profName = Object.keys(profObj)[0];
	var OverallRating = profObj[profName][0][0];
	var DifficultyRating = profObj[profName][0][1];
	var profArray = profObj[profName];
	console.log(profName, OverallRating, DifficultyRating);
	if(OverallRating !== null){
		var overallElem = "<p><span style='font-weight:bold'>Rating: </span>" + OverallRating + "</p>";
		var difficultyElem = "<p><span style='font-weight:bold'>Difficulty: </span>" + DifficultyRating + "</p>";
		var profUrl = "<a target='_blank'href='" + profArray[1] + "'>Ratings Page</a>";
		for(var i = 2; i < profArray.length; i++){
			var id = profArray[i];
			$(document.getElementById(id)).append(overallElem);
			$(document.getElementById(id)).append(difficultyElem);
			$(document.getElementById(id)).append(profUrl);
		}
	}
	else{
		var noData = "<p>No data available</p>";
		for(var i = 2; i < profArray.length; i++){
			var id = profArray[i];
			$(document.getElementById(id)).append(noData);
		}
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

observer.observe(targetNode, config);

