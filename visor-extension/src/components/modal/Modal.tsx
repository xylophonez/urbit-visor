import React from "react";
import * as CSS from 'csstype';
import { useEffect, useLayoutEffect, useState, useRef, useCallback } from "react";
import { urbitVisor } from "@dcspark/uv-core";
import Urbit from "@urbit/http-api";
import { Messaging } from "../../messaging";
import { VisorSubscription } from "../../types";
import Inputbox from "./Inputbox";
import Body from "./Body";

const Modal = () => {
  const rootRef = useRef(null);
  const [selected, setSelected] = useState(null);
  const [dims, setDims] = useState(null);
  const [selectedToInput, setSelectedToInput] = useState(null);
  const [keyDown, setKeyDown] = useState(null);
  const [nextArg, setNextArg] = useState(null);
  const [sendCommand, setSendCommand] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [airlockResponse, setAirlockResponse] = useState(null);

  useEffect(() => {setNextArg(null); setSendCommand(null)}, [nextArg, sendCommand])

  const handleMessage = (e: any) => {
    if (e.data == 'focus') {
      console.log('focusing')
      rootRef.current.focus()
    }
    else console.log('not focusing')
  }

  useEffect(() => {
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  })

/*
  useEffect(() => {
    const sub = urbitVisor.on("connected", [], () => {
      handleConnection()
    });
    handleConnection();
    return () => urbitVisor.off(sub)
  })

  const handleConnection = () => {
    if (isConnected) {
      return
    }
    else {
      urbitVisor.isConnected().then(connected => {
        if (connected.response) {
          setIsConnected(true);
        }
        else {
          urbitVisor.promptConnection();
        }
      });
    }
  }
*/

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key == 'Enter' && selectedToInput !== selected) {
      event.preventDefault();
      setSelectedToInput(selected);
      setAirlockResponse(null)
    }
    else if (event.key == 'Enter' && selected == selectedToInput) {
      event.preventDefault();
      setSendCommand(true)
    }
    else if (event.key == ' ' && selected == selectedToInput) {
      event.preventDefault();
      setNextArg(true)
    }
    else if (event.key == 'Escape') {
      console.log('sending close')
      event.preventDefault();
      window.top.postMessage('close', "*")
    }
    else {
    setKeyDown(event);
    return
    }
  }
  return (
  <div style={{display: 'flex', flexDirection: 'column', height: '100%'}} ref={rootRef} id={"modalContainer"} onKeyDown={(event: React.KeyboardEvent) => handleKeyDown(event)} tabIndex={-1}>
    <Inputbox selected={selectedToInput} nextArg={nextArg} sendCommand={sendCommand} airlockResponse={(res: any) => setAirlockResponse(res)} />
    <Body handleSelection={(i: String) => setSelected(i)} selected={selected} keyDown={keyDown} airlockResponse={airlockResponse} />
  </div>
  )
};

export default Modal;
