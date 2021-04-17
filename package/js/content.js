let timeout = null;
const delayToHide = 3000;
let $sHelper = null;

let currentBreakpoint = null;
let bootstrapVersion = null;

let helperPosition = 'top-right';

window.onload = function() {
    // Get options
    chrome.storage.sync.get(
        { bootstrapHelperIndicatorPosition: 'top-right' },
        (items) => helperPosition = items.bootstrapHelperIndicatorPosition
    );

    bootstrapVersion = checkBootstrapVersion();
    if (bootstrapVersion == null)
        return;

    // Get the local breakpoint
    currentBreakpoint = getBreakpoint(bootstrapVersion, window.innerWidth);
    sendUpdateBreakpoint();
    // Wait to get Options, and display the helper
    setTimeout(displaySimpleHelper, 500);
};

/**
 * @returns {boolean}
 */
function isBootstraped() {
    return checkBootstrapVersion() != null;
}

/**
 * TODO: use more references to make the test stronger
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
            [class*="container-sm"], [class*="container-md"], [class*="container-lg"], [class*="container-xl"], 
            [class*="offset-xs-"], [class*="offset-sm-"], [class*="offset-md-"], [class*="offset-lg-"], [class*="offset-xl-"],
            [class*="form-control-sm"], [class*="form-control-lg"]
        `).length > 0) {
        version = 4;
    }
    // Version 5.x
    if ($(`
            [class*="col-xxl-"],
            [class*="offset-xxl-"],
            [class*="container-xxl"],
            [class*="g-xs-"], [class*="g-sm-"], [class*="g-md-"], [class*="g-lg-"], [class*="g-xl-"], [class*="g-xxl-"],
            [class*="gx-xs-"], [class*="gx-sm-"], [class*="gx-md-"], [class*="gx-lg-"], [class*="gx-xl-"], [class*="gx-xxl-"],
            [class*="gy-xs-"], [class*="gy-sm-"], [class*="gy-md-"], [class*="gy-lg-"], [class*="gy-xl-"], [class*="gy-xxl-"]
        `).length > 0) {
        version = 5;
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
    timeout = setTimeout(
        () => $('#bh-simple-helper').removeClass('active'),
        delayToHide
    );
}

function buildSimpleHelper() {
    const $sHelper = $(`
        <div id="bh-simple-helper" class="bh-${helperPosition} active">
           <div class="visible-xs d-block d-sm-none">XS</div>
           <div class="visible-sm d-none d-sm-block d-md-none">SM</div>
           <div class="visible-md d-none d-md-block d-lg-none">MD</div>
           <div class="visible-lg d-none d-lg-block d-xl-none">LG</div>
           <div class="visible-xl d-none d-xl-block d-xxl-none">XL</div>
           <div class="visible-xxl d-none d-xl-block">XXL</div>
        </div>
    `);
    $('body').append($sHelper);

    $(window).resize(() => {
        displaySimpleHelper();
        const newBp = getBreakpoint(bootstrapVersion, window.innerWidth);
        if (currentBreakpoint !== newBp) {
            currentBreakpoint = newBp;
            sendUpdateBreakpoint();
        }
    });

    return $sHelper;
}

function sendUpdateBreakpoint() {
    chrome.runtime.sendMessage({
        action: 'updateBreakpoint',
        params: {
            isBootstraped: bootstrapVersion != null,
            version: bootstrapVersion,
            breakpoint: currentBreakpoint
        }
    });
}
