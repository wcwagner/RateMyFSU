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
	var checkForProfessor;
	 try{
	 	checkForProfessor = document.getElementById("MTG_INSTR$0").innerHTML;
	 }
	 catch(professorNotFound){}
	 if(checkForProfessor !== undefined){
	 	console.log("PAGE");
	 		grabProfessors();
	 }
}

function grabProfessors(){

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
