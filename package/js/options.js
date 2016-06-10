// Saves options to chrome.storage.sync.
function save_options() {
    var indPos = document.getElementById('indicator-position').value;
    chrome.storage.sync.set({
        bootstrapHelperIndicatorPosition: indPos,
    }, function() {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function() {
            status.textContent = '';
        }, 750);
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    alert('ploup');
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.sync.get({
        bootstrapHelperIndicatorPosition: 'top-right',
    }, function(items) {
        document.getElementById('indicator-position').value = items.bootstrapHelperIndicatorPosition;
    });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);