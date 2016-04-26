var breakpoints = {
    xs: 0,
    sm: 768,
    md: 992,
    lg: 1200
};
var resizeWidth = {
    xs: 536,
    sm: 768,
    md: 992,
    lg: 1200
};

var lastWindowsCreates = {
    xs: null,
    sm: null,
    md: null,
    lg: null
};
var scrollBarWidth = 0;

var currentBP = null;

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded...');

    //updateBadge();
    updateButton();

    $('.resizer a[data-size="xs"]').click(function(){
        changeWindowSize(resizeWidth.xs);
    });
    $('.resizer a[data-size="sm"]').click(function(){
        changeWindowSize(resizeWidth.sm);
    });
    $('.resizer a[data-size="md"]').click(function(){
        changeWindowSize(resizeWidth.md);
    });
    $('.resizer a[data-size="lg"]').click(function(){
        changeWindowSize(resizeWidth.lg);
    });
    $('#btn-duplicate').click(function(){
        duplicateWindowsInSizes();
    });
    $('#btn-reload-duplicates').click(function(){
        reloadTabsFromActive();
    });
});

function initScrollBarWidth () {
    chrome.runtime.getPlatformInfo(function(platformInfo){
        // If it's Windows
        if (platformInfo.os == chrome.runtime.PlatformOs.WIN) {
            scrollBarWidth = 11;
        }
    })
}

function duplicateWindowsInSizes () {
    console.log('duplicateWindowsInSizes');
    getLWCFromLocalStorage();

    // Get the current window
    chrome.windows.getCurrent({populate:true}, function(window){
        console.log(window);

        // Get the active tab
        var activeTab = null;
        for (var i=0; i<window.tabs.length; i++) {
            if (window.tabs[i].active == true) {
                activeTab = window.tabs[i];
                break;
            }
        }
        // If we well get a tab
        if (activeTab != null) {
            console.log(activeTab);
            // Get url to duplicate
            var url = activeTab.url;

            // Get the current breakpoint
            currentBP = getWindowBreakpoint(window);

            console.log(url, currentBP);

            // For each breakpoint, if is not the current
            // Create a new window to display new tab

            // LG
            duplicateFor('lg', url);
            // MD
            duplicateFor('md', url);
            // SM
            duplicateFor('sm', url);
            // XS
            duplicateFor('xs', url);

        } else {
            console.log('No tab active found');
        }
    });
}

function duplicateFor (breakpointType, url) {
    if (currentBP != breakpointType) {
        // If we have create windows before and it at a good size
        if (lastWindowsCreates[breakpointType] != null) {
            // Get the window
            chrome.windows.get( lastWindowsCreates[breakpointType], { populate: true }, function (getWindow) {
                // Check if exist yet and the width
                if (getWindow != null && getWindowBreakpoint(getWindow) == breakpointType) {
                    checkTabOrCreate(url, getWindow);
                } else {
                    // Create new one
                    createSizedWindowsTo(url, breakpointType);
                }
            });
        } else {
            // Create a new window
            createSizedWindowsTo(url, breakpointType);
        }
    } else {
        saveCreatedWindow(window, breakpointType);
    }
}

function createSizedWindowsTo (url, breakpointMode) {
    chrome.windows.create({
        url: url,
        width: resizeWidth[breakpointMode]+scrollBarWidth,
        focused: true
    }, function(newWindow) {
        // Save the new window
        saveCreatedWindow(newWindow, breakpointMode);
    });
}

function saveCreatedWindow (window, breakpointMode) {
    lastWindowsCreates[breakpointMode] = window.id;
    localStorage['bootstrapHelper_lwc_'+ breakpointMode] = lastWindowsCreates[breakpointMode];
}

function closeDuplicata() {
    /*
    console.log('closeDuplicata');
    getLWCFromLocalStorage();

    if (lastWindowsCreates.xs != null) {

    }
    */
}

function getLWCFromLocalStorage () {
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
}

function checkTabOrCreate (url, window) {
    // Check if the url is not open
    var open = false;
    for (var j=0; j < window.tabs.length; j++) {
        if (window.tabs[j].url == url) {
            open = true;
            chrome.tabs.highlight({
                windowId: window.id,
                tabs: window.tabs[j].index
            });
            break;
        }
    }
    if (!open) {
        chrome.tabs.create({windowId: window.id, url: url, active: true});
    }
}

// To change Window size
// chrome.windows.update(integer windowId, object updateInfo, function callback)
function changeWindowSize(size) {

    chrome.windows.getCurrent(function(window){
        console.log(window);

        chrome.windows.update(window.id, {"width":size + scrollBarWidth});

        //updateBadge();
        updateButton();
    });
}

function updateBadge() {
    // chrome.tabs.query({active: true}, function(queryInfo) {
    chrome.windows.getCurrent(function(window){

        //var width = queryInfo[0].width;
        //console.log(queryInfo);

        var bp = getWindowBreakpoint(window);

        if (bp != undefined) {
            badgeText = " "+ bp + " ";
        } else {
            badgeText = "?";
        }

        chrome.browserAction.setBadgeText({"text": badgeText});
        chrome.browserAction.setBadgeBackgroundColor({"color":[111, 84, 153, 255]});
    });
}

function updateButton() {
    chrome.windows.getCurrent(function(window){
        var width = window.width;
        console.log(window);

        $('.resizer a').removeClass('active');

        if (width - scrollBarWidth >= breakpoints.lg) {
            $('.resizer a[data-size="lg"]').addClass('active');
            // TODO If Bootstrap is used by current website
            changeIconTo('lg', 'current');
        }
        else if (width - scrollBarWidth >= breakpoints.md) {
            $('.resizer a[data-size="md"]').addClass('active');
            changeIconTo('md', 'current');
        }
        else if (width - scrollBarWidth >= breakpoints.sm) {
            $('.resizer a[data-size="sm"]').addClass('active');
            changeIconTo('sm', 'current');
        }
        else if (width - scrollBarWidth > breakpoints.xs) {
            $('.resizer a[data-size="xs"]').addClass('active');
            changeIconTo('xs', 'current');
        }
    });
}

function changeIconTo(breakpoint, tabId) {
    var path = 'icons/icon-19.png';
    // TODO Test if is strictly xs|sm|md|lg ?
    if (breakpoint != undefined) {
        path = 'icons/icon-19-'+ breakpoint +'.png';
    }

    if (tabId == undefined) {
        chrome.browserAction.setIcon({path:path});
    } else if (tabId == 'current') {
        // Look for current tab
        // Get the current window
        chrome.windows.getCurrent({populate:true}, function(window){
            // Get the active tab
            var activeTab = null;
            for (var i=0; i<window.tabs.length; i++) {
                if (window.tabs[i].active == true) {
                    activeTab = window.tabs[i];
                    break;
                }
            }
            // If we well get a tab
            if (activeTab != null) {
                chrome.browserAction.setIcon({path:path, tabId:activeTab.id});
            } else {
                console.log('No tab active found');
            }
        });
    } else {
        // give tabId
        chrome.browserAction.setIcon({path:path, tabId:tabId});
    }
}

function getWindowBreakpoint(window) {
    var width = window.width;
    var bp = undefined;

    if (width - scrollBarWidth > breakpoints.xs) {
        bp = 'xs';
    }
    if (width - scrollBarWidth >= breakpoints.sm) {
        bp = 'sm';
    }
    if (width - scrollBarWidth >= breakpoints.md) {
        bp = 'md';
    }
    if (width - scrollBarWidth >= breakpoints.lg) {
        bp = 'lg';
    }

    return bp;
}

function reloadTabsFromActive () {
    console.log('reloadTabsFromActive');

    // Get the current window
    chrome.windows.getCurrent({populate:true}, function(window){
        console.log(window);

        // Get the active tab
        var activeTab = null;
        for (var i=0; i<window.tabs.length; i++) {
            if (window.tabs[i].active == true) {
                activeTab = window.tabs[i];
                break;
            }
        }
        // If we well get a tab
        if (activeTab != null) {
            reloadTabsForUrl(activeTab.url);
        } else {
            console.log('No tab active found');
        }
    });
}

function reloadTabsForUrl(url) {
    chrome.tabs.query({}, function(tabs) {
        // For all tabs get
        for (var i=0; i < tabs.length; i++) {
            var tab = tabs[i];
            console.log(tab);
            if (tab.url == url) {
                chrome.tabs.reload(tab.id)
            }
        }
    });

    // chrome.tabs.reload(integer tabId, object reloadProperties, function callback)
}