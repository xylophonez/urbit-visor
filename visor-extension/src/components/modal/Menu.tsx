import React from "react";
import * as CSS from 'csstype';
import { useEffect, useState } from "react";

const Menu: React.FunctionComponent = () => {
  return (
  <div style={divStyle}>
    <ul style={listStyle}>
      <li>
        bitcoin
      </li>
      <li>
        poke
      </li>
      <li>
        peek
      </li>
    </ul>
  </div>
  )
};

const divStyle: CSS.Properties = {
  width: '160px',
}

const listStyle: CSS.Properties = {
  listStyleType: 'none',
}

export default Menu;
