var breakpoints = {
    'xs': 0,
    'sm': 768,
    'md': 992,
    'lg': 1200
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded...');

    chrome.windows.getCurrent(function(window){
        console.log(window);


    });
});

// To change Window size
// chrome.windows.update(integer windowId, object updateInfo, function callback)
function changeWindowSize(size) {

    chrome.windows.getCurrent(function(window){
        console.log(window);

        window.width;

        chrome.windows.update(window.id, {"width":size});
    });
}