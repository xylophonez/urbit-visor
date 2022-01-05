import React from "react";
import * as CSS from 'csstype';
import { useEffect, useState } from "react";

const Display: React.FunctionComponent = () => {
  return (
  <div style={divStyle}>
    <p style={{textAlign: 'center'}}>this is display</p>
  </div>
  )
};

const divStyle: CSS.Properties = {
  width: '-webkit-fill-available',
  background: 'lightgray',
}

export default Display;
