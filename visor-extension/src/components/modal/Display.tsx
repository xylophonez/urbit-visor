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
      (Array.isArray(props.airlockResponse)) ?
      (<div>
        {props.airlockResponse.map((line: any, index: number) => (<div key={index} style={{textAlign:'left'}}>{JSON.stringify(line)}</div>))}
      </div>) :
      (typeof props.airlockResponse == 'object') ?
      <ReactJson style={{padding:'15px'}} src={props.airlockResponse} enableClipboard={false} /> :
      (<div style={{textAlign:'center'}}>{JSON.stringify(props.airlockResponse)}</div>) :
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
