import { Messaging } from "./messaging";

function shouldInject(): boolean {
  const documentElement = document.documentElement.nodeName;
  const docElemCheck = documentElement
    ? documentElement.toLowerCase() === 'html'
    : true;
  const { doctype } = window.document;
  const docTypeCheck = doctype ? doctype.name === 'html' : true;
  return docElemCheck && docTypeCheck;
}

function proofOfVisor() {
  (window as any).urbitVisor = true;
}

function embed(fn: Function) {
  const script = document.createElement("script");
  script.text = `(${fn.toString()})();`;
  document.documentElement.appendChild(script);
}

function appendLauncher() {
  const modal = document.createElement("dialog");
  modal.id = "command-launcher";
  document.body.appendChild(modal);
}
appendLauncher();

if (shouldInject()) {
  embed(proofOfVisor)
  Messaging.createProxyController();
}
