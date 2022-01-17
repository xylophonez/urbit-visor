import React from "react";
import * as CSS from 'csstype';
import { useEffect, useState } from "react";
import Menu from "./Menu"
import Display from "./Display"

interface BodyProps {
  handleSelection: (textContent: String) => void;
  keyDown: React.KeyboardEvent;
  selected: String;
  airlockResponse: any;
}

const Body = (props: BodyProps) => {
  return (
  <div style={divStyle}>
    <Menu handleSelection={props.handleSelection} keyDown={props.keyDown} />
    <Display selected={props.selected} airlockResponse={props.airlockResponse} />
  </div>
  )
};

const divStyle: CSS.Properties = {
  display: 'flex',
  justifyContent: 'flex-start',
  padding: '2px',
}

export default Body;
