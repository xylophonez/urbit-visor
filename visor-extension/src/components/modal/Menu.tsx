import React from "react";
import * as CSS from 'csstype';
import { useEffect, useState } from "react";
import MenuOptions from "./MenuOptions"

interface MenuOptionProps {
  handleClick: (textContent: String) => void;
  keyDown: String;
}

const Menu = (props: MenuOptionProps) => {
  return (
  <div style={divStyle}>
    <MenuOptions handleClick={props.handleClick} keyDown={props.keyDown} />
  </div>
  )
};

const divStyle: CSS.Properties = {
  width: '160px',
}


export default Menu;
