import React from "react";
import * as CSS from 'csstype';
import { useEffect, useState } from "react";
import PokeInput from "./input/PokeInput"
import PeekInput from "./input/PeekInput"
import BitcoinInput from "./input/BitcoinInput"

interface InputProps {
  selected: String;
  nextArg: Boolean;
  sendCommand: Boolean;
}

const Inputbox = (props: InputProps) => {
  return (
  <div style={divStyle}>
    {
      (() => {
        switch (props.selected) {
        case 'poke':
          return <PokeInput selected={props.selected} nextArg={props.nextArg} sendCommand={props.sendCommand} />
          break;
        case 'peek':
          return <PeekInput nextArg={props.nextArg} sendCommand={props.sendCommand} />
          break;
        case 'bitcoin':
          return <BitcoinInput nextArg={props.nextArg} sendCommand={props.sendCommand} />
          break;
        default:
        return <input style={inputStyle}></input>
        }
      })()
    }
  </div>
  )
};

const inputStyle: CSS.Properties = {
  fontSize: '20px',
  height: '34px',
  width: '-webkit-fill-available',
  padding: '0',
}

const divStyle: CSS.Properties = {
  padding: '2px',
  outline: 'none',
}

export default Inputbox;
