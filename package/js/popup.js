let currentBP = null;

let closeTimeout = null;
const delayToClose = 2000;

document.addEventListener('DOMContentLoaded', function() {
    updateButton();

    $('.resizer a').click(function(){
        const breakpoint = $(this).attr('data-size');
        changeWindowSize(resizeWidth[getVersion()][breakpoint]);
        closeDelay();
    });
    $('#btn-duplicate').click(function(){
        duplicateWindowsInSizes();
        //closeDelay();
    });
    $('#btn-reload-duplicates').click(function(){
        reloadTabsFromActive();
        closeDelay();
    });
    $('#btn-options').click(function(){
        if (chrome.runtime.openOptionsPage) {
            // New way to open options pages, if supported (Chrome 42+).
            chrome.runtime.openOptionsPage();
        } else {
            // Reasonable fallback.
            window.open(chrome.runtime.getURL('options.html'));
        }
    });

    initScrollBarWidth();
});


function closeDelay() {
    if (closeTimeout != null) {
        clearTimeout(closeTimeout);
    }
    closeTimeout = setTimeout(function(){
        close();
    }, delayToClose);
}


function duplicateWindowsInSizes () {
    console.log('duplicateWindowsInSizes');

    // Get the current window
    chrome.windows.getCurrent({populate:true}, function(window){
        console.log(window);
        const version = getVersion();

        // Get the active tab
        let activeTab = null;
        for (let i=0; i<window.tabs.length; i++) {
            if (window.tabs[i].active === true) {
                activeTab = window.tabs[i];
                break;
            }
        }
        // If we well get a tab
        if (activeTab != null) {
            console.log(activeTab);
            // Get url to duplicate
            const url = activeTab.url;

            // Get the current breakpoint
            currentBP = getWindowBreakpoint(version, window);
            // Save the current window
            saveCreatedWindow(window, currentBP);
            // Will reload cause we have the tab
            checkTabOrCreate(url, window);

            console.log(url, currentBP);

            // For each breakpoint, if is not the current
            // Create a new window to display new tab

            for (let j=bootstrapBreakpointsNames[version].length-1; j>=0; j--) {
                duplicateFor(bootstrapBreakpointsNames[version][j], url);
            }

            // Save in local storage the url
            addUrlDuplicate(url);
        } else {
            console.log('No tab active found');
        }
    });
}

function duplicateFor (breakpointType, url) {
    const lastWindowsCreated = getLastWindowsCreated();

    if (currentBP !== breakpointType) {
        // If we have create windows before and it at a good size
        if (lastWindowsCreated[breakpointType] != null) {
            // Get the window
            chrome.windows.get( lastWindowsCreated[breakpointType], { populate: true }, function (getWindow) {
                // Check if exist yet and the width
                if (getWindow != null && getWindowBreakpoint(getVersion(), getWindow) === breakpointType) {
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
    }
}

function createSizedWindowsTo (url, breakpointMode) {
    chrome.windows.create({
        url: url,
        width: resizeWidth[getVersion()][breakpointMode]+getScrollBarWidth(),
        focused: true
    }, function(newWindow) {
        // Save the new window
        saveCreatedWindow(newWindow, breakpointMode);
    });
}

function closeDuplicata() {
    /*
    console.log('closeDuplicata');
    getLWCFromLocalStorage();

    if (lastWindowsCreated.xs != null) {

    }
    */
}

function checkTabOrCreate (url, window) {
    // Check if the url is not open
    let open = false;
    for (let j=0; j < window.tabs.length; j++) {
        // If already exist
        if (window.tabs[j].url === url) {
            open = true;
            // Reload
            chrome.tabs.reload(window.tabs[j].id);
            // Highlight
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

/**
 * To change Window size
 * @param size
 */
function changeWindowSize(size) {

    chrome.windows.getCurrent(function(window){
        console.log(window);

        chrome.windows.update(window.id, {"width":size + getScrollBarWidth()});

        //updateBadge();
        updateButton();
    });
}

function updateBadge() {
    chrome.windows.getCurrent(function(window){

        //var width = queryInfo[0].width;
        //console.log(queryInfo);

        const bp = getWindowBreakpoint(getVersion(), window);

        if (bp !== undefined) {
            badgeText = " "+ bp + " ";
        } else {
            badgeText = "?";
        }

        chrome.browserAction.setBadgeText({"text": badgeText});
        chrome.browserAction.setBadgeBackgroundColor({"color":[111, 84, 153, 255]});
    });
}

function updateButton() {
    chrome.windows.getCurrent({populate:true}, function(window){
        var width = window.width;
        console.log(window);

        const version = getVersion();
        $('#version-container')
            .removeClass()
            .addClass('v' + version);

        $('.resizer a').removeClass('active');

        if (breakpoints[version].xxl && width - getScrollBarWidth() >= breakpoints[version].xxl) {
            $('.resizer a[data-size="xxl"]').addClass('active');
            // TODO If Bootstrap is used by current website
            //changeIconTo('xxl', 'current');
        }
        else if (breakpoints[version].xl && width - getScrollBarWidth() >= breakpoints[version].xl) {
            $('.resizer a[data-size="xl"]').addClass('active');
            //changeIconTo('xl', 'current');
        }
        else if (breakpoints[version].lg && width - getScrollBarWidth() >= breakpoints[version].lg) {
            $('.resizer a[data-size="lg"]').addClass('active');
            //changeIconTo('lg', 'current');
        }
        else if (breakpoints[version].md && width - getScrollBarWidth() >= breakpoints[version].md) {
            $('.resizer a[data-size="md"]').addClass('active');
            //changeIconTo('md', 'current');
        }
        else if (breakpoints[version].sm && width - getScrollBarWidth() >= breakpoints[version].sm) {
            $('.resizer a[data-size="sm"]').addClass('active');
            //changeIconTo('sm', 'current');
        }
        else if (breakpoints[version].xs !== undefined && width - getScrollBarWidth() > breakpoints[version].xs) {
            $('.resizer a[data-size="xs"]').addClass('active');
            //changeIconTo('xs', 'current');
        }

        // Get the active tab
        var activeTab = null;
        for (var i=0; i<window.tabs.length; i++) {
            if (window.tabs[i].active == true) {
                activeTab = window.tabs[i];
                break;
            }
        }
        console.log('activeTab', activeTab);
        // If we well get a tab
        if (activeTab != null) {
            if (isUrlDuplicate(activeTab.url)) {
                $('#btn-duplicate img')
                    .attr('src', 'img/icon-reload-duplicates.svg')
                    .attr('title', 'Reloads all duplicated tabs');
            }
        }
    });
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
