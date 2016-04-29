function getCurrentTabUrl() {
  chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
    console.log(tabs[0].url);
  });
}

function renderStatus(statusText) {
  $('#status').textContent = statusText;
}

function bindActions() {
  var scanBtn = document.getElementById('scan');
  scanBtn.click(function() {console.log('here....');
    getCurrentTabUrl();
  });
  // $('#detect').click(function() {
  //   getCurrentTabUrl();
  // });
}

document.addEventListener('DOMContentLoaded', function() {
  bindActions();
  getCurrentTabUrl();
  console.log('check here....');
});
