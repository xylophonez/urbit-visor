import React from "react";
import * as CSS from 'csstype';
import { useEffect, useState, useRef } from "react";
import { Messaging } from "../../messaging";
import Urbit from "@urbit/http-api";
import { Command } from "./types";

interface InputProps {
  nextArg: Boolean;
  sendCommand: Boolean;
  airlockResponse: (response: any) => void;
  clearSelected: (clear: Boolean) => void;
  selected: Command;
}

const Input = (props: InputProps) => {
  const inputRef = useRef([])
  const [currentFocus, setCurrentFocus] = useState(null)

  const selection = (window as any).getSelection()


  useEffect(() => {inputRef.current[0].focus(); setCurrentFocus(inputRef.current[0])}, [inputRef.current[0]])
  useEffect(() => {if (!props.nextArg) {return} else if (currentFocus == inputRef.current[0]) {inputRef.current[1].focus(); setCurrentFocus(inputRef.current[1])}}, [props.nextArg])
  useEffect(() => {if (!props.nextArg) {return} else if (currentFocus == inputRef.current[1]) {inputRef.current[2].focus(); setCurrentFocus(inputRef.current[2])}}, [props.nextArg])

  useEffect(() => {
    if (!props.sendCommand) return;
    else if (inputRef.current.every(el => {if (el.innerHTML) {true} else false})) {
      const arg = {app: inputRef.current[0].innerHTML, mark: inputRef.current[1].innerHTML, json: inputRef.current[2].innerHTML}
      const data = {action: 'poke', argument: arg}
      Messaging.sendToBackground({action: "call_airlock", data: data}).then(res => handleAirlockResponse(res))
      inputRef.current[0].innerHTML = '';
      inputRef.current[1].innerHTML = '';
      inputRef.current[2].innerHTML = '';
      inputRef.current[0].focus();
    }
    else {
      let inputs = [inputRef.current[0], inputRef.current[1], inputRef.current[2]]
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
      {props.selected?.command}
    </div>
    <div>
      {
        props.selected.arguments
          .map((arg: string, i: number) => <div key={i} className="div-input" contentEditable="true" style={inputStyle} data-placeholder={arg} onKeyDown={(event: React.KeyboardEvent) => {if (event.key == 'Backspace' && (event.target as Element).innerHTML == "") { props.clearSelected(true) } else {(event.target as Element).classList.remove('highlight-required')}}} ref={el => (inputRef.current = [...inputRef.current, el])}></div>)
      }
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

export default Input;
