import React from "react";
import * as CSS from 'csstype';
import { useEffect, useState, useRef } from "react";
import { urbitVisor } from "@dcspark/uv-core";

interface InputProps {
  nextArg: Boolean;
  sendCommand: Boolean;
}

const SpiderInput = (props: InputProps) => {
  const markInInput = useRef(null);
  const markOutInput = useRef(null);
  const threadNameInput = useRef(null);
  const jsonInput = useRef(null);
  const [currentFocus, setCurrentFocus] = useState(null)

  const selection = (document.querySelector("html > div").shadowRoot as any).getSelection()

  useEffect(() => {threadNameInput.current.focus(); setCurrentFocus("threadName")}, [threadNameInput])
  useEffect(() => {if (!props.nextArg) {return} else if (currentFocus == 'threadName') {markInInput.current.focus(); setCurrentFocus("markIn")}}, [props.nextArg])
  useEffect(() => {if (!props.nextArg) {return} else if (currentFocus == 'markIn') {markOutInput.current.focus(); setCurrentFocus("markOut")}}, [props.nextArg])
  useEffect(() => {if (!props.nextArg) {return} else if (currentFocus == 'markOut') {jsonInput.current.focus(); setCurrentFocus("json")}}, [props.nextArg])

  useEffect(() => {
    if (!props.sendCommand) {return}
    else if (threadNameInput.current.innerHTML && markInInput.current.innerHTML && markOutInput.current.innerHTML && jsonInput.current.innerHTML)
      {urbitVisor.thread({'threadName':threadNameInput.current.innerHTML,'inputMark':markInInput.current.innerHTML,'outputMark':markOutInput.current.innerHTML,'body':jsonInput.current.innerHTML})}
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
      thread:
    </div>
    <div>
      <div className="div-input" contentEditable="true" style={inputStyle} data-placeholder="thread name" ref={threadNameInput}></div>
    </div>
    <div>
      <div className="div-input" contentEditable="true" style={inputStyle} data-placeholder="input mark" ref={markInInput} onKeyDown={(event: React.KeyboardEvent) => {if (event.key == 'Backspace' && (event.target as Element).innerHTML == "") {threadNameInput.current.focus(); event.preventDefault(); setCurrentFocus("threadName"); selection.setPosition(selection.focusNode, selection.focusNode.length)}}}></div>
    </div>
    <div>
      <div className="div-input" contentEditable="true" style={inputStyle} data-placeholder="output mark" ref={markOutInput} onKeyDown={(event: React.KeyboardEvent) => {if (event.key == 'Backspace' && (event.target as Element).innerHTML == "") {markInInput.current.focus(); event.preventDefault(); setCurrentFocus("markIn"); selection.setPosition(selection.focusNode, selection.focusNode.length)}}}></div>
    </div>
    <div>
      <div className="div-input" contentEditable="true" style={inputStyle} data-placeholder="body" ref={jsonInput} onKeyDown={(event: React.KeyboardEvent) => {if (event.key == 'Backspace' && (event.target as Element).innerHTML == "") {markOutInput.current.focus(); event.preventDefault(); setCurrentFocus("markOut"); selection.setPosition(selection.focusNode, selection.focusNode.length)}}}></div>
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

export default SpiderInput;
