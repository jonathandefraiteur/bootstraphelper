chrome.runtime.onStartup.addListener(function(activeInfo) {
    initLWCLocalStorage();
    initScrollBarWidth();
});

chrome.runtime.onInstalled.addListener(function(details) {
    
    if (details.reason === "install") {
        // Open thank's page
        chrome.tabs.create({url: "/thanks.html", active: true});
    } else if (details.reason === "update") {
        // TODO Display "new", and link to updates...
        console.log("Updated", details);
    }
});
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    console.log(message, sender);

    if (message.action != null) {
        if (message.action === 'updateBreakpoint') {
            setVersion(message.params.version);
            changeIconTo(message.params.version, message.params.breakpoint, sender.tab.id);
        }
    }

    sendResponse('received');
});
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    console.log(request, sender);

    if (request.action != null) {
        if (request.action === 'isBootstraped') {
            changeIconTo(
                (request.message)? getBreakpoint(sender.tab.width) : null,
                sender.tab.id
            );
        }
        else if (request.action === 'changeIcon') {
            changeIconTo(request.message, sender.tab.id);
        }
    }

    sendResponse('received');
});
chrome.tabs.onActivated.addListener(function(activeInfo) {
    //updateBadge();
});
chrome.tabs.onMoved.addListener(function(activeInfo) {
    //updateBadge();
});

chrome.windows.onRemoved.addListener(function (windowId) {
    removeWindow(windowId);
});

// CONTEXT MENU //
let contextPageActionId = [];
// Documentation TODO: Add v4 Documentation
contextPageActionId['doc'] = chrome.contextMenus.create({
    "title": "Doc · CSS",
    "contexts":["browser_action"],
    "onclick": function(){
        chrome.tabs.create({url: "http://getbootstrap.com/css/", active: true});
    }
});
contextPageActionId['doc'] = chrome.contextMenus.create({
    "title": "Doc · Components",
    "contexts":["browser_action"],
    "onclick": function(){
        chrome.tabs.create({url: "http://getbootstrap.com/components/", active: true});
    }
});
contextPageActionId['doc'] = chrome.contextMenus.create({
    "title": "Doc · Javascript",
    "contexts":["browser_action"],
    "onclick": function(){
        chrome.tabs.create({url: "http://getbootstrap.com/javascript/", active: true});
    }
});
contextPageActionId['doc'] = chrome.contextMenus.create({
    "title": "Doc · Customize",
    "contexts":["browser_action"],
    "onclick": function(){
        chrome.tabs.create({url: "http://getbootstrap.com/customize/", active: true});
    }
});
contextPageActionId['separator-1'] = chrome.contextMenus.create({
    "type": "separator",
    "contexts":["browser_action"]
});
// Rate
contextPageActionId['rate'] = chrome.contextMenus.create({
    "title": "🌟 Rate It ",
    "contexts":["browser_action"],
    "onclick": function(){
        chrome.tabs.create({url: "https://chrome.google.com/webstore/detail/bootstrap-helper/bnkadmnhdpkpbfmaehgjeijgopkjinbl/reviews", active: true});
    }
});
