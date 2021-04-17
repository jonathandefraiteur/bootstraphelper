const bootstrapBreakpointsNames = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];

/**
 * Check if given name is well a bootstrap breakpoint name
 * @param name
 * @returns {boolean}
 */
function isValidBreakpoint (name) {
    return (bootstrapBreakpointsNames.indexOf(name) >= 0);
}

const breakpointBadgeColors = {
    xs: [107, 21, 161, 255],
    sm: [128, 28, 161, 255],
    md: [150, 35, 161, 255],
    lg: [172, 42, 161, 255],
    xl: [194, 49, 161, 255],
    xxl: [216, 56, 161, 255]
};

/**
 * Breakpoints used by Bootstrap
 * @type {{3: {xs: number, sm: number, md: number, lg: number}, 4: {xs: number, sm: number, md: number, lg: number, xl: number}, 5: {xs: number, sm: number, md: number, lg: number, xxl: number}}}
 */
const breakpoints = {
    3: {
        xs: 0,
        sm: 768,
        md: 992,
        lg: 1200
    },
    4: {
        xs: 0,
        sm: 576,
        md: 768,
        lg: 992,
        xl: 1200
    },
    5: {
        xs: 0,
        sm: 576,
        md: 768,
        lg: 992,
        xl: 1200,
        xxl: 1400
    }
};

/**
 * Size to use for each breakpoint
 * @type {{xs: number, sm: number, md: number, lg: number}}
 */
const resizeWidth = {
    xs: 536,
    sm: 776,
    md: 1000,
    lg: 1208
};

/**
 * Init the scroll-bar width in the local storage
 */
function initScrollBarWidth () {
    chrome.runtime.getPlatformInfo(function(platformInfo){
        let scrollBarWidth = 0;
        // If it's Windows
        if (platformInfo.os === chrome.runtime.PlatformOs.WIN) {
            scrollBarWidth = 11;
        }
        // TODO: here the fix for the linux user
        localStorage.setItem('bootstrapHelper_sbw', scrollBarWidth);
    })
}

/**
 * Get the scroll-bar width from the local storage
 * @returns {number}
 */
function getScrollBarWidth () {
    const width = localStorage.getItem('bootstrapHelper_sbw');
    return (width != null)? parseInt(width) : 0;
}

/**
 * @param {number} version
 * @param {number} width
 * @returns {string|undefined}
 */
function getBreakpoint(version, width) {
    let bp = undefined;

    for (let i=0; i<bootstrapBreakpointsNames.length; i++) {
        const bpn = bootstrapBreakpointsNames[i];
        if (width - getScrollBarWidth() >= breakpoints[version][bpn]) {
            bp = bpn;
        }
    }

    return bp;
}

/**
 * @param {number} version
 * @param window
 * @returns {string|undefined}
 */
function getWindowBreakpoint(version, window) {
    return getBreakpoint(version, window.width);
}



/////                      /////
///// LAST WINDOWS CREATED /////
/////                      /////

/**
 * Init the local storage data
 */
function initLWCLocalStorage () {
    let lwc = {};
    if (localStorage.getItem('bootstrapHelper_lwc') != null) {
        lwc = getLWCFromLocalStorage();
    }
    for (let i=0; i<bootstrapBreakpointsNames.length; i++) {
        if (lwc[bootstrapBreakpointsNames[i]] === undefined) {
            lwc[bootstrapBreakpointsNames[i]] = null;
        }
    }
    storeLWCInLocalStorage(lwc);
}

/**
 * Get th last windows createed from local storage
 * @return {*}
 */
function getLWCFromLocalStorage () {
    return JSON.parse(localStorage.getItem('bootstrapHelper_lwc'));
}

/**
 * Set the last windows created in local storage
 * @param lastWindowsCreated
 */
function storeLWCInLocalStorage (lastWindowsCreated) {
    localStorage.setItem('bootstrapHelper_lwc', JSON.stringify(lastWindowsCreated));
}

/**
 * Return the last windows creates by pick it in local storage
 * @param breakpoint
 * @returns number|{{xs: null|number, sm: null|number, md: null|number, lg: null|number}}
 */
function getLastWindowsCreated (breakpoint) {
    const lwc = getLWCFromLocalStorage();
    if (isValidBreakpoint(breakpoint)) {
        return lwc[breakpoint];
    } else {
        return (lwc != null)? lwc : {};
    }
}

/**
 * Save a new window for a breakpoint
 * @param window
 * @param breakpointMode
 */
function saveCreatedWindow (window, breakpointMode) {
    const lwc = getLastWindowsCreated();
    lwc[breakpointMode] = window.id;
    storeLWCInLocalStorage(lwc);
}

/**
 * Look in data and remove windows from it if found
 * @param windowId
 */
function removeWindow (windowId) {
    const lwc = getLWCFromLocalStorage();
    for (let i=0; i<bootstrapBreakpointsNames.length; i++) {
        if (lwc[bootstrapBreakpointsNames[i]] === windowId) {
            lwc[bootstrapBreakpointsNames[i]] = null;
        }
    }
    storeLWCInLocalStorage(lwc);
}

function getUDFromLocalStorage () {
    return JSON.parse(localStorage.getItem('bootstrapHelper_ud'));
}

function storeUDInLocalStorage (urlDuplicated) {
    localStorage.setItem('bootstrapHelper_ud', JSON.stringify(urlDuplicated));
}

/**
 * Add the given url at local storage
 * @param url
 */
function addUrlDuplicate (url) {
    let ud = [];
    if (localStorage.getItem('bootstrapHelper_ud') != null) {
        ud = getUDFromLocalStorage();
    }
    for (let i=0; i<ud.length; i++) {
        if (ud[i] === url) {
            return;
        }
    }
    ud.push(url);
    storeUDInLocalStorage(ud);
}

/**
 * Check if this url was already duplicated
 * @param url
 * @returns {boolean}
 */
function isUrlDuplicate (url) {
    if (localStorage.getItem('bootstrapHelper_ud') != null) {
        ud = getUDFromLocalStorage();
        for (let i=0; i<ud.length; i++) {
            if (ud[i] === url) {
                return true;
            }
        }
    }
    return false;
}



/////      /////
///// ICON /////
/////      /////

/**
 *
 * @param {number?} version
 * @param {string?} breakpoint
 * @param {number?} tabId
 */
function changeIconTo(version, breakpoint, tabId) {
    console.log('changeIconTo()', version, breakpoint, tabId);
    let path = 'icons/icon-19.png';
    if (version) {
        path = `icons/icon-19-v${version}.png`;
    } else {
        chrome.browserAction.setBadgeText({"text": null});
    }

    if (tabId === undefined) {
        chrome.browserAction.setIcon({path:path});
        if (isValidBreakpoint(breakpoint)) {
            chrome.browserAction.setBadgeText({text: ` ${breakpoint.toUpperCase()} `});
            chrome.browserAction.setBadgeBackgroundColor({color: breakpointBadgeColors[breakpoint]});
        }
    } else if (tabId === 'current') {
        // Look for current tab
        // Get the current window
        chrome.windows.getCurrent({populate:true}, function(window){
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
                // Recall the function with a tab ID
                changeIconTo(breakpoint, activeTab.id);
            } else {
                console.log('No tab active found');
            }
        });
    } else {
        // Use tabId to update the icon
        chrome.browserAction.setIcon({
            path:path,
            tabId:tabId
        });
        if (isValidBreakpoint(breakpoint)) {
            chrome.browserAction.setBadgeText({
                text: ` ${breakpoint.toUpperCase()} `,
                tabId:tabId
            });
            chrome.browserAction.setBadgeBackgroundColor({
                color: breakpointBadgeColors[breakpoint],
                tabId:tabId
            });
        }
    }
}
