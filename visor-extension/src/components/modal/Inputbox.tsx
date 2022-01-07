import React from "react";
import * as CSS from 'csstype';
import { useEffect, useState } from "react";

const Inputbox: React.FunctionComponent = () => {
  return (
  <div style={divStyle}>
  <input style={inputStyle}></input>
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
