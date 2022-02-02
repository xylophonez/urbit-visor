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
  useEffect(() => {console.log('refs changed')}, [inputRef])
  useEffect(() => {inputRef.current = []}, [props.selected])
  useEffect(() => {console.log('sendcommand changed')}, [props.sendCommand])
  useEffect(() => {console.log('nextarg changed')}, [props.nextArg])
/*
  useEffect(() => {inputRef.current[0].focus(); setCurrentFocus(inputRef.current[0])}, [inputRef.current[0]])
  useEffect(() => {if (!props.nextArg) {return} else if (currentFocus == inputRef.current[0]) {inputRef.current[1].focus(); setCurrentFocus(inputRef.current[1])}}, [props.nextArg])
  useEffect(() => {if (!props.nextArg) {return} else if (currentFocus == inputRef.current[1]) {inputRef.current[2].focus(); setCurrentFocus(inputRef.current[2])}}, [props.nextArg])
*/
  useEffect(() => {
    console.log(inputRef.current)
    if (!props.sendCommand) return;
    else if (inputRef.current.every(el => (el?.innerHTML) ? true : false)) {
      const arg = Object.fromEntries(props.selected.arguments.map((k, i) => [k, inputRef.current[i].innerHTML]))
      const data = {action: props.selected.command, argument: arg}
      Messaging.sendToBackground({action: "call_airlock", data: data}).then(res => handleAirlockResponse(res))
      inputRef.current.forEach(input => {input.innerHTML = ''})
      inputRef.current[0].focus();
    }
    else {
      console.log('not sending poke')
      inputRef.current.forEach(input => {if (input?.innerHTML == '') input.classList.add('highlight-required')})
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
          .map((arg: string, i: number) => <div key={i} className="div-input" contentEditable="true" style={inputStyle} data-placeholder={arg} onKeyDown={(event: React.KeyboardEvent) => {if (event.key == 'Backspace' && (event.target as Element).innerHTML == "") { props.clearSelected(true) } else {(event.target as Element).classList.remove('highlight-required')}}} ref={el => inputRef.current[i] = el}></div>)
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
