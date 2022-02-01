import React from "react";
import * as CSS from "csstype";
import { useEffect, useState, useRef } from "react";
import Urbit from "@urbit/http-api";
import PokeInput from "./input/PokeInput";
import ScryInput from "./input/ScryInput";
import BitcoinInput from "./input/BitcoinInput";
import SubscribeInput from "./input/SubscribeInput";
import SpiderInput from "./input/SpiderInput";
import TerminalInput from "./input/TerminalInput";
import { Command } from "./types";
import Input from "./Input";


interface InputProps {
  selected: Command;
  baseFocus: Boolean;
  nextArg: Boolean;
  sendCommand: Boolean;
  airlockResponse: (response: any) => void;
  clearSelected: (clear: Boolean) => void;
}


const Inputbox = (props: InputProps) => {
  const baseInput = useRef(null);
  useEffect(() => {if (!props.selected) baseInput.current.focus()}, [props.baseFocus])
  return (
    <div style={divStyle} className="modal-input-box">
      {
      (props.selected)
      ? <Input selected={props.selected} nextArg={props.nextArg} sendCommand={props.sendCommand} airlockResponse={props.airlockResponse} clearSelected={props.clearSelected} />
      : <input ref={baseInput}></input>
      }
    </div>
  );
};

const inputStyle: CSS.Properties = {
  fontSize: '18px',
  height: '34px',
  width: '-webkit-fill-available',
  padding: '0',
};

const divStyle: CSS.Properties = {
  padding: '2px',
  fontSize: '18px',
  height: '34px',
  outline: 'none',
};

export default Inputbox;
