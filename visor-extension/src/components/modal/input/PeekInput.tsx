import React from "react";
import * as CSS from 'csstype';
import { useEffect, useState, useRef } from "react";

interface InputProps {
  nextArg: Boolean;
}

const PeekInput = (props: InputProps) => {
  const moldInput = useRef(null);
  const careInput = useRef(null);
  const pathInput = useRef(null);
  const [currentFocus, setCurrentFocus] = useState(null)
  
  const selection = (document.querySelector("html > div").shadowRoot as any).getSelection()

  useEffect(() => {moldInput.current.focus(); setCurrentFocus("mold")}, [moldInput])
  useEffect(() => {if (!props.nextArg) {return} else if (currentFocus == 'mold') {careInput.current.focus(); setCurrentFocus("care")}}, [props.nextArg])
  useEffect(() => {if (!props.nextArg) {return} else if (currentFocus == 'care') {pathInput.current.focus(); setCurrentFocus("path")}}, [props.nextArg])


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
      peek:
    </div>
    <div>
      <div className="div-input" contentEditable="true" style={inputStyle} data-placeholder="mold" ref={moldInput} onKeyDown={(event: React.KeyboardEvent) => {if (event.key == 'Backspace' && (event.target as Element).innerHTML == "") {return}}}></div>
    </div>
    <div>
      <div className="div-input" contentEditable="true" style={inputStyle} data-placeholder="care" ref={careInput} onKeyDown={(event: React.KeyboardEvent) => {if (event.key == 'Backspace' && (event.target as Element).innerHTML == "") {moldInput.current.focus(); event.preventDefault(); setCurrentFocus("mold"); selection.setPosition(selection.focusNode, selection.focusNode.length)}}}></div>
    </div>
    <div>
      <div className="div-input" contentEditable="true" style={inputStyle} data-placeholder="path" ref={pathInput} onKeyDown={(event: React.KeyboardEvent) => {if (event.key == 'Backspace' && (event.target as Element).innerHTML == "") {careInput.current.focus(); event.preventDefault(); setCurrentFocus("care"); selection.setPosition(selection.focusNode, selection.focusNode.length)}}}></div>
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

export default PeekInput;
