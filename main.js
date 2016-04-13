var targetNode = document;
var timeOut = null;
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
	/*var checkForProfessor;
	 try{
	 	checkForProfessor = document.getElementById("MTG_INSTR$0").innerHTML;
	 }
	 catch(professorNotFound){}
	 if(checkForProfessor !== undefined){
	 		grabProfessors();
	 }*/
}

function grabProfessors(){
	var regex = /[A-z]+\ [A-z]+/;
	var count = 0;
	var currProfId = "MTG_INSTR$" + count;
	var currProfName = "";
	var Professors = [];
	var ProfObj = {};
	do{

		currProfId = "MTG_INSTR$" + count;
		currProfElem = document.getElementById(currProfId);
		if( currProfElem){
			currProfName = currProfElem.innerHTML;
			currProfName = currProfName.match(regex);
			if(!ProfObj[currProfName]){
				console.log("Adding " + currProfName + " to object");
				ProfObj[currProfName] = [];
				ProfObj[currProfName][0] = "";
			}
			ProfObj[currProfName].push(currProfId);
			Professors.push(currProfName);
		}
		count++;
	}while(currProfElem !== null);
	console.log(ProfObj);
	for(var key in ProfObj)
	getProfessorRatings(ProfObj);
}

function getProfessorRatings(profArray){
	chrome.runtime.sendMessage(ProfObj, function(response){
		//console.log(response.farewell);
	});

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
