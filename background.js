chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse) {
        if (request.action == "open_new_tab") {
            chrome.tabs.getSelected(null, function(tab) {
                chrome.tabs.create({
                    windowId: tab.windowId,
                    index: tab.index + 1,
                    url: request.url,
                    selected: request.foreground 
                });
            });
            sendResponse({});
            return;
        }
        sendResponse({});
    }
);