chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
      var all = document.getElementsByTagName("*");
      console.log(all);
    }
  }
);