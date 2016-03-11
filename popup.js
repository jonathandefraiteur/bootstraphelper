var breakpoints = {
    'xs': 0,
    'sm': 768,
    'md': 992,
    'lg': 1200
};
var resizeWidth = {
    'xs': 536,
    'sm': 768,
    'md': 992,
    'lg': 1200
};

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded...');

    updateBadge();
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
});

// To change Window size
// chrome.windows.update(integer windowId, object updateInfo, function callback)
function changeWindowSize(size) {

    chrome.windows.getCurrent(function(window){
        console.log(window);
        // TODO Actually use +11 to avoid scroll bar possibility, change it
        chrome.windows.update(window.id, {"width":size + 11});

        updateBadge();
        updateButton();
    });
}

function updateBadge() {
    // chrome.tabs.query({active: true}, function(queryInfo) {
    chrome.windows.getCurrent(function(window){

        //var width = queryInfo[0].width;
        //console.log(queryInfo);

        var width = window.width;
        console.log(window);
        var badgeText = "?";

        if (width-11 > breakpoints.xs) {
            badgeText = " xs ";
        }
        if (width-11 >= breakpoints.sm) {
            badgeText = " sm ";
        }
        if (width-11 >= breakpoints.md) {
            badgeText = " md ";
        }
        if (width-11 >= breakpoints.lg) {
            badgeText = " lg ";
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

        chrome.browserAction.setBadgeText({"text": badgeText});
        chrome.browserAction.setBadgeBackgroundColor({"color":[111, 84, 153, 255]});
    });
}