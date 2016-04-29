var blacklistedTags = ['SCRIPT', 'NOSCRIPT'];
var whitelistedStyles = [
  'fontFamily',
  'fontSize',
  'color',
  'fontWeight',
  'lineHeight',
  'margin',
  'border',
  'padding',
  'display',
  'position',
  'zIndex'
];

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.message === "getDOM") {
      var contents = document.body;
      console.log(contents);
      // Do something with DOM object here
      var text = loopThroughDOM(contents);
      // Acknowledge request
      sendResponse(text);
    }
  }
);

function getAssertAttributes(element) {
  var text = '';
  if (element.attributes.length == 0) {
    return text;
  }

  if (element.attributes.hasOwnProperty('class')) {
    text += 'class = ' + element.attributes.class.value + ', ';
  }
  if (element.attributes.hasOwnProperty('id')) {
    text += 'id = ' + element.attributes.id.value + ', ';
  }

  return text;
}

function getAssertStyles(element) {
  var text = '';
  var styles = getComputedStyle(element);
  if (styles.length == 0) {
    return text;
  }

  for (var i = 0; i < whitelistedStyles.length; i++) {
    var style = whitelistedStyles[i];
    text += style + ' : ' + styles[style] + ', ';
  }

  return text;
}

function loopThroughDOM(element) {
  var text = '';

  // exclude blacklisted tags ...
  if (blacklistedTags.indexOf(element.tagName) > -1) {
    return text;
  }

  text += getAssertAttributes(element);
  text += getAssertStyles(element);

  for (var i = 0; i < element.children.length; i++) {
    var child = element.children[i];
    text += loopThroughDOM(child);
  }

  return text;
}