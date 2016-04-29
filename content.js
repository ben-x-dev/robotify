chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.message === "getDOM") {
      var contents = document.body.children;
      // Do something with DOM object here
      console.log(contents);
      // Acknowledge request
      sendResponse('success');
    }
  }
);