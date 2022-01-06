import React from "react";
import * as CSS from 'csstype';
import { useEffect, useState } from "react";

interface MenuOptionProps {
  handleClick: (textContent: String) => void;
  keyDown: String;
}

const options = ['bitcoin', 'poke', 'peek'];
 
const MenuOptions = (props: MenuOptionProps) => {
  const [clickedIndex, setClickedIndex] = useState(-1);

  useEffect(() => {if (props.keyDown === 'ArrowDown') {setClickedIndex(clickedIndex + 1)}}, [props.keyDown])
  useEffect(() => {if (props.keyDown === 'ArrowUp') {setClickedIndex(clickedIndex - 1)}}, [props.keyDown])


  return (
    <ul style={listStyle}>
      {options.map((option, index) => <li style={(index == clickedIndex) ? {border:'outset'} : {border:'none'}} onClick={(event) => {props.handleClick((event.target as HTMLElement).textContent)}} key={option}>{option}</li>)}
    </ul>
  )
};

const listStyle: CSS.Properties = {
  listStyleType: 'none',
}

export default MenuOptions;
