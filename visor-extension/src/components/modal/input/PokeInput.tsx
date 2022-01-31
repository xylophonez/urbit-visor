import React from "react";
import * as CSS from 'csstype';
import { useEffect, useState, useRef } from "react";
import { Messaging } from "../../../messaging";
import Urbit from "@urbit/http-api";

interface InputProps {
  nextArg: Boolean;
  sendCommand: Boolean;
  airlockResponse: (response: any) => void;
  clearSelected: (clear: Boolean) => void;
}

const PokeInput = (props: InputProps) => {
  const markInput = useRef(null);
  const appInput = useRef(null);
  const jsonInput = useRef(null);
  const [currentFocus, setCurrentFocus] = useState(null)

  const selection = (window as any).getSelection()


  useEffect(() => {appInput.current.focus(); setCurrentFocus("app")}, [appInput])
  useEffect(() => {if (!props.nextArg) {return} else if (currentFocus == 'app') {markInput.current.focus(); setCurrentFocus("mark")}}, [props.nextArg])
  useEffect(() => {if (!props.nextArg) {return} else if (currentFocus == 'mark') {jsonInput.current.focus(); setCurrentFocus("json")}}, [props.nextArg])

  useEffect(() => {
    if (!props.sendCommand) return;
    else if (appInput.current.innerHTML && markInput.current.innerHTML && jsonInput.current.innerHTML) {
      const arg = {app: appInput.current.innerHTML, mark: markInput.current.innerHTML, json: jsonInput.current.innerHTML}
      const data = {action: 'poke', argument: arg}
      Messaging.sendToBackground({action: "call_airlock", data: data}).then(res => handleAirlockResponse(res))
      appInput.current.innerHTML = '';
      markInput.current.innerHTML = '';
      jsonInput.current.innerHTML = '';
      appInput.current.focus();
    }
    else {
      let inputs = [appInput.current, markInput.current, jsonInput.current]
      inputs.forEach(input => {if (input.innerHTML == '') input.classList.add('highlight-required')})
    }},
    [props.sendCommand])

  const handleAirlockResponse = (res: any) => {props.airlockResponse(res)}

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
     '}',
     '.highlight-required {',
     '  border: red;',
     '  border-style: solid;',
     '  border-width: thin;',
     '}'
    ].join('\n')
  }}>
  </style>
    <div>
      poke:
    </div>
    <div>
      <div className="div-input" contentEditable="true" style={inputStyle} data-placeholder="app" onKeyDown={(event: React.KeyboardEvent) => {if (event.key == 'Backspace' && (event.target as Element).innerHTML == "") { props.clearSelected(true) } else {(event.target as Element).classList.remove('highlight-required')}}} ref={appInput}></div>
    </div>
    <div>
      <div className="div-input" contentEditable="true" style={inputStyle} data-placeholder="mark" ref={markInput} onKeyDown={(event: React.KeyboardEvent) => {if (event.key == 'Backspace' && (event.target as Element).innerHTML == "") {appInput.current.focus(); event.preventDefault(); setCurrentFocus("app"); selection.setPosition(selection.focusNode, selection.focusNode.length)} else {(event.target as Element).classList.remove('highlight-required')}}}></div>
    </div>
    <div>
      <div className="div-input" contentEditable="true" style={inputStyle} data-placeholder="json" ref={jsonInput} onKeyDown={(event: React.KeyboardEvent) => {if (event.key == 'Backspace' && (event.target as Element).innerHTML == "") {markInput.current.focus(); event.preventDefault(); setCurrentFocus("mark"); selection.setPosition(selection.focusNode, selection.focusNode.length)} else {(event.target as Element).classList.remove('highlight-required')}}}></div>
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

export default PokeInput;
