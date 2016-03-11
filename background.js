var breakpoints = {
    'xs': 0,
    'sm': 768,
    'md': 992,
    'lg': 1200
};
var resizeWidth = {
    'xs': 536,
    'sm': 768,
    'md': 992,
    'lg': 1200
};

function updateBadge() {
    // chrome.tabs.query({active: true}, function(queryInfo) {
    chrome.windows.getCurrent(function(window){

        //var width = queryInfo[0].width;
        //console.log(queryInfo);

        var width = window.width;
        console.log(window);
        var badgeText = "?";

        if (width-11 > breakpoints.xs) {
            badgeText = " xs ";
        }
        if (width-11 >= breakpoints.sm) {
            badgeText = " sm ";
        }
        if (width-11 >= breakpoints.md) {
            badgeText = " md ";
        }
        if (width-11 >= breakpoints.lg) {
            badgeText = " lg ";
        }

        chrome.browserAction.setBadgeText({"text": badgeText});
        chrome.browserAction.setBadgeBackgroundColor({"color":[111, 84, 153, 255]});
    });

}

chrome.runtime.onStartup.addListener(function(activeInfo) {
    updateBadge();
});
chrome.runtime.onInstalled.addListener(function(activeInfo) {
    updateBadge();
});
chrome.tabs.onActivated.addListener(function(activeInfo) {
    updateBadge();
});
chrome.tabs.onMoved.addListener(function(activeInfo) {
    updateBadge();
});