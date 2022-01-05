import React from "react";
import * as CSS from 'csstype';
import { useEffect, useState } from "react";
import Menu from "./Menu"
import Display from "./Display"

const Body: React.FunctionComponent = () => {
  return (
  <div style={divStyle}>
    <Menu />
    <Display />
  </div>
  )
};

const divStyle: CSS.Properties = {
  display: 'flex',
  justifyContent: 'flex-start',
  padding: '2px',
}

export default Body;
