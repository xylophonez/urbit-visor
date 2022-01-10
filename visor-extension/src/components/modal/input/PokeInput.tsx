import React from "react";
import * as CSS from 'csstype';
import { useEffect, useState, useRef } from "react";

interface InputProps {
  selected: String;
  nextArg: Boolean;
}

const PokeInput = (props: InputProps) => {
  const shipInput = useRef(null);
  const appInput = useRef(null);
  const cageInput = useRef(null);
  const [currentFocus, setCurrentFocus] = useState(null)

  useEffect(() => {shipInput.current.focus(); setCurrentFocus("ship")}, [shipInput])
  useEffect(() => {if (!props.nextArg) {return} else if (currentFocus == 'ship') {appInput.current.focus(); setCurrentFocus("app")}}, [props.nextArg])
  useEffect(() => {if (!props.nextArg) {return} else if (currentFocus == 'app') {cageInput.current.focus(); setCurrentFocus("cage")}}, [props.nextArg])

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
      poke:
    </div>
    <div>
      <div className="div-input" contentEditable="true" style={inputStyle} data-placeholder="ship" ref={shipInput}></div>
    </div>
    <div>
      <div className="div-input" contentEditable="true" style={inputStyle} data-placeholder="app" ref={appInput}></div>
    </div>
    <div>
      <div className="div-input" contentEditable="true" style={inputStyle} data-placeholder="cage" ref={cageInput}></div>
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
