import React from "react";
import * as CSS from 'csstype';
import { useEffect, useState } from "react";

interface DisplayProps {
  selected: String;
}

const Display = (props: DisplayProps) => {
  return (
  <div style={divStyle}>
    <p style={{textAlign:'center'}}>{props.selected} display to be rendered here</p>
  </div>
  )
};

const divStyle: CSS.Properties = {
  width: '-webkit-fill-available',
  background: 'lightgray',
}

export default Display;
