let timeout = null;
const delayToHide = 3000;
let $sHelper = null;

let currentBreakpoint = null;

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

    if (isBootstraped()) {
        //console.log('BootstrapHelper - Page use Bootstrap');
        // Wait to get Options
        setTimeout(function(){
            displaySimpleHelper();
        }, 500);

        currentBreakpoint = getBreakpoint(window.innerWidth);
        console.log('currentBreakpoint', currentBreakpoint);
        chrome.extension.sendRequest({
            action: 'changeIcon',
            message: currentBreakpoint
        });

        request.message = true;
    }
    /*else {
        console.log('BootstrapHelper - Page DON\'T use Bootstrap');
    }*/

    //chrome.extension.sendRequest(request);

};

function isBootstraped() {
    // If website use col-*-* classes, considere it use bootstrap
    return $('[class*="col-xs-"], [class*="col-sm-"], [class*="col-md-"], [class*="col-lg-"]').length > 0;
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
        const newBp = getBreakpoint(window.innerWidth);
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
