window.onload = function() {

    if (isBootstraped()) {
        console.log('BootstrapHelper - Page use Bootstrap');
        displaySimpleHelper();

    } else {
        console.log('BootstrapHelper - Page DON\'T use Bootstrap');
    }

};

var timeout = null;
var delayToHide = 3000;
var $sHelper = null;

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
    });

    return $sHelper;
}