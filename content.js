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

      var text = "Set Suite Variable    ${main}    css=[id='main'] \n" +
                 "   @{elements} = Create List    ${main}\n";

      text += loopThroughDOM(contents, '${main}', false);

      text += '\n:   FOR    ${element}    IN    @{elements}\n' +
              '\\       Run And Wait Until Keyword Succeeds    Element Should Be Visible    ${element}\n';

      // Acknowledge request
      sendResponse(text);
    }
  }
);

function getAssertAttributes(element, parent) {
  var text = '';
  if (element.attributes.length == 0) {
    return {};
  }

  var attr = element.attributes[0];
  var selector = parent + ' [' + attr.name + '="' + attr.value + '"]';
  text += '...    ' + selector + '\n';

  return {
    selector: selector,
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

function loopThroughDOM(element, parent, append) {
  var text = '';

  // exclude blacklisted tags ...
  if (blacklistedTags.indexOf(element.tagName) > -1) {
    return text;
  }

  var selector = parent;
  var attr = {};
  if (append) {
    attr = getAssertAttributes(element, parent);
    if (attr.selector && attr.text) {
      selector = attr.selector;
      // text += getAssertStyles(element);
    }
  }

  var currentText = '', previousText = '';
  for (var i = 0; i < element.children.length; i++) {
    var child = element.children[i];
    currentText = loopThroughDOM(child, selector, true);
    if (currentText != previousText) {
      text += currentText;
    }
    previousText = currentText;
  }

  if (text === '' && attr.text) {
    text += attr.text;
  }

  return text;
}