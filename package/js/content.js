let timeout = null;
const delayToHide = 3000;
let $sHelper = null;

let currentBreakpoint = null;
let bootstrapVersion = null;

let helperPosition = 'tr';

window.onload = function() {

    // Get options
    chrome.storage.sync.get({
        bootstrapHelperIndicatorPosition: 'top-right',
    }, function(items) {
        const pos = items.bootstrapHelperIndicatorPosition;
        if (pos === 'top-left') {
            helperPosition = 'tl';
        }
        else if (pos === 'top-right') {
            helperPosition = 'tr';
        }
        else if (pos === 'bottom-left') {
            helperPosition = 'bl';
        }
        else if (pos === 'bottom-right') {
            helperPosition = 'br';
        }
    });


    let request = {
        action: 'isBootstraped',
        message: false
    };

    bootstrapVersion = checkBootstrapVersion();
    if (bootstrapVersion != null) {
        //console.log('BootstrapHelper - Page use Bootstrap');
        // Wait to get Options
        setTimeout(function(){
            displaySimpleHelper();
        }, 500);

        currentBreakpoint = getBreakpoint(bootstrapVersion, window.innerWidth);
        // TODO: sendRequest() is deprecated
        chrome.extension.sendRequest({
            action: 'changeIcon',
            message: currentBreakpoint
        });
        chrome.runtime.sendMessage({
            action: 'UpdateBreakpoint',
            message: {
                isBootstraped: true,
                version: bootstrapVersion,
                breakpoint: currentBreakpoint
            }
        });

        request.message = true;
    }

    //chrome.extension.sendRequest(request);

};

/**
 * @returns {boolean}
 */
function isBootstraped() {
    return checkBootstrapVersion() != null;
}

/**
 * @see https://www.quackit.com/bootstrap/bootstrap_4/differences_between_bootstrap_3_and_bootstrap_4.cfm
 *
 * @returns {number|null}
 */
function checkBootstrapVersion() {
    let version = null;

    // Version 3.x
    if ($(`
            [class*="col-xs-"], [class*="col-sm-"], [class*="col-md-"], [class*="col-lg-"],
            [class*="col-xs-offset-"], [class*="col-sm-offset-"], [class*="col-md-offset-"], [class*="col-lg-offset-"]
        `).length > 0) {
        version = 3;
    }
    // Version 4.x
    if ($(`
            [class*="col-xl-"],
            [class*="offset-xs-"], [class*="offset-sm-"], [class*="offset-md-"], [class*="offset-lg-"], [class*="offset-xl-"],
            [class*="form-control-sm"], [class*="form-control-lg"]
        `).length > 0) {
        version = 4;
    }

    return version;
}

function displaySimpleHelper() {
    if ($sHelper == null) {
        $sHelper = buildSimpleHelper();
    }

    $sHelper.addClass('active');

    if (timeout != null) {
        clearTimeout(timeout);
    }
    timeout = setTimeout(function(){
        $('#bh-simple-helper').removeClass('active');
    }, delayToHide);
}

function buildSimpleHelper() {
    const $sHelper = $(
        '<div id="bh-simple-helper" class="bh-' + helperPosition + ' active">' +
        '   <div class="visible-xs  d-block d-sm-none">XS</div>' +
        '   <div class="visible-sm  d-none d-sm-block d-md-none">SM</div>' +
        '   <div class="visible-md  d-none d-md-block d-lg-none">MD</div>' +
        '   <div class="visible-lg  d-none d-lg-block d-xl-none">LG</div>' +
        '   <div class="visible-lg  d-none d-xl-block">XL</div>' +
        '</div>');
    $('body').append($sHelper);

    $(window).resize(function(){
        displaySimpleHelper();
        const newBp = getBreakpoint(bootstrapVersion, window.innerWidth);
        if (currentBreakpoint !== newBp) {
            currentBreakpoint = newBp;
            //console.log('currentBreakpoint', currentBreakpoint);
            // TODO Tips but not clear, admit background manage this request by change icon
            chrome.extension.sendRequest({
                action: 'changeIcon',
                message: currentBreakpoint
            });
        }
    });

    return $sHelper;
}
