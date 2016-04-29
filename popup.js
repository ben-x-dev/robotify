function getCurrentTabUrl() {
  chrome.tabs.getCurrent(function(tab) {console.log(tab);
    renderStatus(tab.url);
  });
}

function renderStatus(statusText) {
  $('#status').textContent = statusText;
}

function bindActions() {
  $('#scan').click(function() {console.log('here....');
    getCurrentTabUrl();
  });
  $('#detect').click(function() {
    getCurrentTabUrl();
  });
}

document.addEventListener('DOMContentLoaded', function() {
  bindActions();
  getCurrentTabUrl();
  console.log('check here....');
});
