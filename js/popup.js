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
});

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
        // If we wel get a tab
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
                if (getWindow != null && getWindow.width >= breakpoints[breakpointType]) {
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
        width: resizeWidth[breakpointMode]+11,
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
            chrome.tabs.highlight({tabs: window.tabs[j].id});
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
        // TODO Actually use +11 to avoid scroll bar possibility, change it
        chrome.windows.update(window.id, {"width":size + 11});

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

        if (width-11 >= breakpoints.lg) {
            $('.resizer a[data-size="lg"]').addClass('active');
        }
        else if (width-11 >= breakpoints.md) {
            $('.resizer a[data-size="md"]').addClass('active');
        }
        else if (width-11 >= breakpoints.sm) {
            $('.resizer a[data-size="sm"]').addClass('active');
        }
        else if (width-11 > breakpoints.xs) {
            $('.resizer a[data-size="xs"]').addClass('active');
        }
    });
}

function getWindowBreakpoint(window) {
    var width = window.width;
    var bp = undefined;

    if (width-11 > breakpoints.xs) {
        bp = 'xs';
    }
    if (width-11 >= breakpoints.sm) {
        bp = 'sm';
    }
    if (width-11 >= breakpoints.md) {
        bp = 'md';
    }
    if (width-11 >= breakpoints.lg) {
        bp = 'lg';
    }

    return bp;
}