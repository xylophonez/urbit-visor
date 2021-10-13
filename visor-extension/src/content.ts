import {Messaging} from "uv-core";

function shouldInject(): boolean {
  const documentElement = document.documentElement.nodeName;
  const docElemCheck = documentElement
    ? documentElement.toLowerCase() === 'html'
    : true;
  const { doctype } = window.document;
  const docTypeCheck = doctype ? doctype.name === 'html' : true;
  return docElemCheck && docTypeCheck;
}
if (shouldInject()) {
  // injectScript();
  // injectModal();
  Messaging.createProxyController();
}
