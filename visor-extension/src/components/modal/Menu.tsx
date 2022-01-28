import React from 'react';
import * as CSS from 'csstype';
import { useEffect, useState } from 'react';
import MenuOptions from './MenuOptions';

interface MenuOptionProps {
  handleSelection: (textContent: String) => void;
  keyDown: React.KeyboardEvent;
  selected: String;
}

const Menu = (props: MenuOptionProps) => {
  return (
    <div style={divStyle} className="command-launcher-menu">
      <MenuOptions selected={props.selected} handleSelection={props.handleSelection} keyDown={props.keyDown} />
    </div>
  );
};

const divStyle: CSS.Properties = {
  width: '160px',
};

export default Menu;
