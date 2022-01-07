import React from "react";
import * as CSS from 'csstype';
import { useEffect, useState } from "react";
import Menu from "./Menu"
import Display from "./Display"


const Body = () => {
  const [selected, setSelected] = useState(null);
  const [keyDown, setKeyDown] = useState(null);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    setKeyDown(event);
    return
  }
  useEffect(() => console.log(`${selected} is currently selected`), [selected])
  return (
  <div style={divStyle} onKeyDown={(event: React.KeyboardEvent) => handleKeyDown(event)} tabIndex={-1}>
    <Menu handleSelection={(i: String) => setSelected(i)} keyDown={keyDown} />
    <Display selected={selected} />
  </div>
  )
};

const divStyle: CSS.Properties = {
  display: 'flex',
  justifyContent: 'flex-start',
  padding: '2px',
}

export default Body;
