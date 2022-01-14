import React from "react";
import * as CSS from 'csstype';
import { useEffect, useState, useRef } from "react";
import { urbitVisor } from "@dcspark/uv-core";
import { Messaging } from "@dcspark/uv-core";
import Urbit from "@urbit/http-api";

interface InputProps {
  nextArg: Boolean;
  sendCommand: Boolean;
}

const SubscribeInput = (props: InputProps) => {
  const appInput = useRef(null);
  const pathInput = useRef(null);
  const [currentFocus, setCurrentFocus] = useState(null)

  const selection = (document.querySelector("html > div").shadowRoot as any).getSelection()

  useEffect(() => {appInput.current.focus(); setCurrentFocus("app")}, [appInput])
  useEffect(() => {if (!props.nextArg) {return} else if (currentFocus == 'app') {pathInput.current.focus(); setCurrentFocus("path")}}, [props.nextArg])

  useEffect(() => {
    if (!props.sendCommand) {return}
    else if (appInput.current.innerHTML && pathInput.current.innerHTML) {
      const arg = {'app':appInput.current.innerHTML,'path':pathInput.current.innerHTML}
      const data = {action: 'subscribe', argument: arg}
      Messaging.sendToBackground({action: "call_airlock", data: data}).then(res => console.log(res, "did thing"))
    }
    else {
      alert('please provide all arguments')
    }},
    [props.sendCommand])

  return (
  <div style={divStyle}> 
  <style dangerouslySetInnerHTML={{
  __html: [
     '.div-input {',
     '  display: inline-block;',
     '  vertical-align: top;',
     '  min-width: 1em;',
     '  padding: 0px 5px 0px 5px;',
     '  cursor: text;',
     '}',
     '.div-input:empty:before {',
     '  content: attr(data-placeholder);',
     '  color: #ccc;',
     '}',
     '.div-input br {',
     '  display: none;',
     '}',
     '.div-input * {',
     '  display: inline;',
     '}'
    ].join('\n')
  }}>
  </style>
    <div>
      subscribe:
    </div>
    <div>
      <div className="div-input" contentEditable="true" style={inputStyle} data-placeholder="app" ref={appInput}></div>
    </div>
    <div>
      <div className="div-input" contentEditable="true" style={inputStyle} data-placeholder="path" ref={pathInput} onKeyDown={(event: React.KeyboardEvent) => {if (event.key == 'Backspace' && (event.target as Element).innerHTML == "") {appInput.current.focus(); event.preventDefault(); setCurrentFocus("app"); selection.setPosition(selection.focusNode, selection.focusNode.length)}}}></div>
    </div>
  </div>
  )
};

const divStyle: CSS.Properties = {
  display: 'flex'
}
const inputStyle: CSS.Properties = {
  width: 'fit-content'
}

export default SubscribeInput;
