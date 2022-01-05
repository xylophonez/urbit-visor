import React from "react";
import ReactDOM from "react-dom";
import { Messaging } from "./messaging";
import Modal from "./components/modal/Modal";

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
  modal.style.width = '690px';
  modal.style.padding = '0';
  shadowDOM.appendChild(modal);
  document.documentElement.appendChild(shadowWrapper);
  const react = React.createElement(Modal)
  ReactDOM.render(react, modal);
}
appendLauncher();

if (shouldInject()) {
  embed(proofOfVisor)
  Messaging.createProxyController();
}
