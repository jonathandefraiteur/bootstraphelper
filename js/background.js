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

function getLWCFromLocalStorage () {
    var lastWindowsCreates = {
        xs: null,
        sm: null,
        md: null,
        lg: null
    };

    if (localStorage.bootstrapHelper_lwc_xs != undefined) {
        lastWindowsCreates.xs = parseInt(localStorage.bootstrapHelper_lwc_xs);
    }
    if (localStorage.bootstrapHelper_lwc_sm != undefined) {
        lastWindowsCreates.sm = parseInt(localStorage.bootstrapHelper_lwc_sm);
    }
    if (localStorage.bootstrapHelper_lwc_md != undefined) {
        lastWindowsCreates.md = parseInt(localStorage.bootstrapHelper_lwc_md);
    }
    if (localStorage.bootstrapHelper_lwc_lg != undefined) {
        lastWindowsCreates.lg = parseInt(localStorage.bootstrapHelper_lwc_lg);
    }

    return lastWindowsCreates;
}

chrome.runtime.onStartup.addListener(function(activeInfo) {
    //updateBadge();
});
chrome.runtime.onInstalled.addListener(function(activeInfo) {
    //updateBadge();
});
chrome.tabs.onActivated.addListener(function(activeInfo) {
    //updateBadge();
});
chrome.tabs.onMoved.addListener(function(activeInfo) {
    //updateBadge();
});

chrome.windows.onRemoved.addListener(function (windowId) {
    var lwc = getLWCFromLocalStorage();

    if (windowId == lwc.xs) {
        localStorage.removeItem('bootstrapHelper_lwc_xs');
    }
    if (windowId == lwc.sm) {
        localStorage.removeItem('bootstrapHelper_lwc_sm');
    }
    if (windowId == lwc.md) {
        localStorage.removeItem('bootstrapHelper_lwc_md');
    }
    if (windowId == lwc.lg) {
        localStorage.removeItem('bootstrapHelper_lwc_lg');
    }
});