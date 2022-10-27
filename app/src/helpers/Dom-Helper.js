export default class DOMHelper {
  static parseStringToDOM(string) {
    const parser = new DOMParser();
    return parser.parseFromString(string, 'text/html');
  }

  static wrapTextNodes(DOM) {
    const body = DOM.body;
    let textNodes = new Array();
    function recursy(element) {
      element.childNodes.forEach((node) => {
        if (
          node.nodeName === '#text' &&
          node.nodeValue.replace(/\s+/g, '').length > 0
        ) {
          textNodes.push(node);
        } else {
          recursy(node);
        }
      });
    }
    recursy(body);
    textNodes.forEach((node, index) => {
      const wrapper = DOM.createElement('text-editor');
      node.parentNode.replaceChild(wrapper, node);
      wrapper.appendChild(node);
      wrapper.setAttribute('nodeid', index);
    });
    return DOM;
  }

  static serializeDOMToString(DOM) {
    const serializer = new XMLSerializer();
    return serializer.serializeToString(DOM);
  }

  static unwrapTextNode(DOM) {
    DOM.body.querySelectorAll('text-editor').forEach((element) => {
      element.parentNode.replaceChild(element.firstChild, element);
    });
  }

  static wrapImages(DOM) {
    DOM.body.querySelectorAll('img').forEach((img, idx) => {
      img.setAttribute('editableimgid', idx);
    });
    return DOM;
  }

  static unwrapImages(DOM) {
    DOM.body.querySelectorAll('[editableimgid]').forEach((img) => {
      img.removeAttribute('editableimgid');
    });
  }
}
