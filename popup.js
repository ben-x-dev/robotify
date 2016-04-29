
function generateTextFile(text) {
  console.log(text);

  var blob = new Blob([text], {type: "text/plain;charset=utf-8"});
  saveAs(blob, "robot.txt");
}

function getDOM() {
  chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
    console.log(tabs[0].url);

    var bg = chrome.extension.getBackgroundPage();

    bg.getDOM(tabs[0], generateTextFile);
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
