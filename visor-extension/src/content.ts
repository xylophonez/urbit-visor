import React from "react";
import ReactDOM from "react-dom";
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
  const shadowWrapper = document.createElement("div");
  const shadowDOM = shadowWrapper.attachShadow({mode: "open"});
  const modal = document.createElement("dialog");
  modal.id = "command-launcher-container";
  modal.style.padding = '0';
  const frame = document.createElement("iframe");
  frame.src = "chrome-extension://oadimaacghcacmfipakhadejgalcaepg/launcher.html";
  frame.id = 'frame';
  frame.style.height = '300px';
  modal.appendChild(frame);
  shadowDOM.appendChild(modal);
  document.documentElement.appendChild(shadowWrapper);
  const handleHotkeys = (e: any) => {
    if (e.data == 'close') {
      console.log('closing')
      const modal: any = <any>document.querySelector("html > div").shadowRoot.querySelector("#command-launcher-container");
      modal.close()
    }
    else console.log('not closing')
  }
  window.addEventListener('message', handleHotkeys)
}
appendLauncher();

if (shouldInject()) {
  embed(proofOfVisor)
  Messaging.createProxyController();
}
