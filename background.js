var getDOM = function(activeTab, responseCallback) {
  chrome.tabs.sendMessage(activeTab.id, {"message": "getDOM"}, responseCallback);
};