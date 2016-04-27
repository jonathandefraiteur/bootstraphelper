var bootstrapBreakpointsNames = ['xs','sm','md','lg'];

/**
 * Check if given name is well a bootstrap breakpoint name
 * @param name
 * @returns {boolean}
 */
function isValidBreakpoint (name) {
    return (bootstrapBreakpointsNames.indexOf(name) >= 0);
}

/**
 * Breakpoints used by Bootstrap
 * @type {{xs: number, sm: number, md: number, lg: number}}
 */
var breakpoints = {
    xs: 0,
    sm: 768,
    md: 992,
    lg: 1200
};

/**
 * Size to use for each breakpoint
 * @type {{xs: number, sm: number, md: number, lg: number}}
 */
var resizeWidth = {
    xs: 536,
    sm: 768,
    md: 992,
    lg: 1200
};

function initScrollBarWidth () {
    chrome.runtime.getPlatformInfo(function(platformInfo){
        var scrollBarWidth = 0;
        // If it's Windows
        if (platformInfo.os == chrome.runtime.PlatformOs.WIN) {
            scrollBarWidth = 11;
        }
        localStorage.setItem('bootstrapHelper_sbw', scrollBarWidth);
    })
}

function getScrollBarWidth () {
    return parseInt(localStorage.getItem('bootstrapHelper_sbw'));
}

function getWindowBreakpoint(window) {
    var width = window.width;
    var bp = undefined;

    for (var i=0; i<bootstrapBreakpointsNames.length; i++) {
        var bpn = bootstrapBreakpointsNames[i];
        if (width - getScrollBarWidth() >= breakpoints[bpn]) {
            bp = bpn;
        }
    }

    return bp;
}



/////                      /////
///// LAST WINDOWS CREATED /////
/////                      /////

/**
 * Init the local storage data
 */
function initLWCLocalStorage () {
    var lwc = {};
    if (localStorage.getItem('bootstrapHelper_lwc') != null) {
        lwc = getLWCFromLocalStorage();
    }
    for (var i=0; i<bootstrapBreakpointsNames.length; i++) {
        if (lwc[bootstrapBreakpointsNames[i]] == undefined) {
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
    if (isValidBreakpoint(breakpoint)) {
        var lwc = getLWCFromLocalStorage();
        return lwc[breakpoint];
    } else {
        var lwc = getLWCFromLocalStorage();
        return (lwc != null)? lwc : {};
    }
}

/**
 * Save a new window for a breakpoint
 * @param window
 * @param breakpointMode
 */
function saveCreatedWindow (window, breakpointMode) {
    var lwc = getLastWindowsCreated();
    lwc[breakpointMode] = window.id;
    storeLWCInLocalStorage(lwc);
}

/**
 * Look in data and remove windows from it if found
 * @param windowId
 */
function removeWindow (windowId) {
    var lwc = getLWCFromLocalStorage();
    for (var i=0; i<bootstrapBreakpointsNames.length; i++) {
        if (lwc[bootstrapBreakpointsNames[i]] == windowId) {
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
    var ud = [];
    if (localStorage.getItem('bootstrapHelper_ud') != null) {
        ud = getUDFromLocalStorage();
    }
    for (var i=0; i<ud.length; i++) {
        if (ud[i] == url) {
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
        for (var i=0; i<ud.length; i++) {
            if (ud[i] == url) {
                return true;
            }
        }
    }
    return false;
}