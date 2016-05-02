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
                 "   @{elements}    Create List    ${main}\n";

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

  // var selector = '';
  // for (var i = 0; i < element.attributes.length; i++) {
  //   var attr = element.attributes[i];
  //   text += '${attribValue}    Get Element Attribute    css=' + parent +  + '@' + attr.name + '\n';
  //   text += 'Should Be Equal    ${attribValue}    ' + attr.value + '\n\n';

  //   if (i == 0) {
  //     selector = '[' + attr.name + '="' + attr.value + '"]';
  //   }
  // }
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
  if (append) {
    var attr = getAssertAttributes(element, parent);
    if (attr.selector && attr.text) {
      selector = attr.selector;
      text += attr.text;
      // text += getAssertStyles(element);
    }
  }

  for (var i = 0; i < element.children.length; i++) {
    var child = element.children[i];
    text += loopThroughDOM(child, selector, true);
  }

  return text;
}