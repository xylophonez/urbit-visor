import React from "react";
import * as CSS from 'csstype';
import { useEffect, useState, useRef } from "react";
import ReactJson from 'react-json-view'

interface DisplayProps {
  selected: String;
  airlockResponse: any;
}

const Display = (props: DisplayProps) => {


  return (
  <div style={divStyle}>
    {
      (props.airlockResponse) ?
      (typeof props.airlockResponse !== 'object') ?
      (<div style={{textAlign:'center'}}>{JSON.stringify(props.airlockResponse)}</div>) :
      <ReactJson style={{padding:'15px'}} src={props.airlockResponse} enableClipboard={false} /> :
      <div></div>
    }
  </div>
  )
};

const divStyle: CSS.Properties = {
  width: '-webkit-fill-available',
  background: 'lightgray',
}

export default Display;
