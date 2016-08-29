chrome.runtime.onMessage.addListener(
    function(request, sender, callback) {
        if (request.action == "xhttp") {
            var xhr = new XMLHttpRequest();
            xhr.onload = function() {
                callback({
                    htmlStr: xhr.responseText,
                    name: request.name,
                    ids: request.ids
                });
            };
            xhr.onerror = function() {
                callback();
            };
            xhr.open(request.method, request.url, true);
            if (request.method == 'POST') {
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            }
            //send(str) used for POST
            xhr.send('');
            //async callback
            return true; 
        }
    }
);