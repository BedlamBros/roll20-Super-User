chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	chrome.storage.sync.get({charLanguages: {}}, function(items){ 
		sendResponse({data: items.charLanguages});
	});
	return true;
});