
function getDOM() {
  chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
    console.log(tabs[0].url);

    var bg = chrome.extension.getBackgroundPage();

    bg.getDOM(tabs[0], function(data) {
      console.log(data);
    });
  });
}

function bindActions() {
  $('#scan').click(function() {
    getDOM();
  });
}

document.addEventListener('DOMContentLoaded', function() {
  bindActions();
});
