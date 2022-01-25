import React from "react";
import * as CSS from 'csstype';
import { useEffect, useState, useRef, useCallback } from "react";
import { Messaging } from "../../../messaging";
import Urbit from "@urbit/http-api";
import { urbitVisor } from "@dcspark/uv-core";

interface InputProps {
  nextArg: Boolean;
  sendCommand: Boolean;
  airlockResponse: (response: any) => void;
}

const TerminalInput = (props: InputProps) => {
  const terminalInput = useRef(null);
  const [currentFocus, setCurrentFocus] = useState(null)
  const [subscribed, setSubscribed] = useState(null)
  const [lines, setLines] = useState([]);


  const selection = (window as any).getSelection()


  useEffect(() => {terminalInput.current.focus(); setCurrentFocus("terminal")}, [terminalInput])
  useEffect(() => {
    window.addEventListener('message', handleHerm)
  })
  useEffect(() => {
      let number = 0;
      const setData = () => {
      urbitVisor.subscribe({app: 'herm', path: '/session//view'})
        .then((res) => number = res.response)
      }
      urbitVisor.require(["subscribe"], setData);
      return () => {
            window.removeEventListener("message", handleHerm);
            urbitVisor.unsubscribe(number).then(res => console.log(""));
       }},
    [])

  useEffect(() => {
    if (!props.sendCommand) return;
    else if (terminalInput.current.innerHTML) {
      const arg1 = {app: 'herm', mark: 'belt', json: { txt: [terminalInput.current.innerHTML] }}
      const data1 = {action: 'poke', argument: arg1}
      const arg2: any = {app: 'herm', mark: 'belt', json: { ret: null }}
      const data2 = {action: 'poke', argument: arg2}
      Messaging.sendToBackground({action: "call_airlock", data: data1})
      Messaging.sendToBackground({action: "call_airlock", data: data2})
    }
    else {
      alert('please provide all arguments')
    }},
    [props.sendCommand])

    const handleHerm = useCallback((message: any) => {
        if (
            message.data.app == "urbitVisorEvent" &&
            message.data.event.data &&
            message.data.event.data.lin
        ) {
            const dojoLine = message.data.event.data.lin.join("");
            if (!(dojoLine.includes("dojo>") || dojoLine[0] === ";" || dojoLine[0] === ">")) {
                setLines((previousState) => [...previousState, dojoLine]);
            }
            else return
        }
    }, []);

  useEffect(() => {props.airlockResponse(lines)}, [lines])

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
      terminal:
    </div>
    <div>
      <div className="div-input" contentEditable="true" style={inputStyle} data-placeholder="command" ref={terminalInput}></div>
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

export default TerminalInput;
