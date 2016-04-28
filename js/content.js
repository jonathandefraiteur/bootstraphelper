var timeout = null;
var delayToHide = 3000;
var $sHelper = null;

var currentBreakpoint = null;

window.onload = function() {

    var request = {
        action: 'isBootstraped',
        message: false
    };

    if (isBootstraped()) {
        //console.log('BootstrapHelper - Page use Bootstrap');
        displaySimpleHelper();

        currentBreakpoint = getBreakpoint(window.innerWidth);
        console.log('currentBreakpoint', currentBreakpoint);

        request.message = true;
    }
    /*else {
        console.log('BootstrapHelper - Page DON\'T use Bootstrap');
    }*/

    chrome.extension.sendRequest(request);
};

function isBootstraped() {
    // If website use col-*-* classes, considere it use bootstrap
    if ($('[class*="col-xs-"], [class*="col-sm-"], [class*="col-md-"], [class*="col-lg-"]').length > 0) {
        return true;
    } else {
        false;
    }
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
    var $sHelper = $(
        '<div id="bh-simple-helper" class="bh-tr active">' +
        '   <div class="visible-xs">XS</div>' +
        '   <div class="visible-sm">SM</div>' +
        '   <div class="visible-md">MD</div>' +
        '   <div class="visible-lg">LG</div>' +
        '</div>');
    $('body').append($sHelper);

    $(window).resize(function(){
        displaySimpleHelper();
        var newBp = getBreakpoint(window.innerWidth);
        if (currentBreakpoint != newBp) {
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