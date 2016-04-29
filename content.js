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
      var contents = document.getElementById('main');
      console.log(contents);

      var text = '${main}    Execute Javascript    return document.getElementById("main")\n\n';
      text += loopThroughDOM(contents, '${main}');

      // Acknowledge request
      sendResponse(text);
    }
  }
);

function getAssertAttributes(element, parent) {
  var text = '';
  if (element.attributes.length == 0) {
    return text;
  }

  var selector = '';
  for (var i = 0; i < element.attributes.length; i++) {
    var attr = element.attributes[i];
    if (i == 0) {
      selector = '[' + attr.name + '="' + attr.value + '"]';
    }
    text += '${attribValue}    Get Element Attribute    css=' + parent + ' ' + selector + '@' + attr.name + '\n';
    text += 'Should Be Equal    ${attribValue}    ' + attr.value + '\n\n';
  }

  return {
    selector: parent + ' ' + selector,
    text: text
  };
}

function getAssertStyles(element) {
  var text = '';
  var styles = getComputedStyle(element);
  if (styles.length == 0) {
    return text;
  }

  for (var i = 0; i < whitelistedStyles.length; i++) {
    var style = whitelistedStyles[i];
    text += style + ' : ' + styles[style] + '\n';
  }

  return text;
}

function loopThroughDOM(element, parent) {
  var text = '';

  // exclude blacklisted tags ...
  if (blacklistedTags.indexOf(element.tagName) > -1) {
    return text;
  }

  var attr = getAssertAttributes(element, parent);
  if (attr.text !== '') {
    text += attr.text;
    // text += getAssertStyles(element);
  }


  for (var i = 0; i < element.children.length; i++) {
    var child = element.children[i];
    text += loopThroughDOM(child, attr.selector);
  }

  return text;
}